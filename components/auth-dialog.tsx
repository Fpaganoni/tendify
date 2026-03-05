"use client";

import type React from "react";
import { useState, useMemo } from "react";
import {
  User,
  LogIn,
  UserPlus,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";

// ─── Password Strength Logic ───────────────────────────────────────────────
type StrengthLevel = "empty" | "weak" | "fair" | "strong";

function getPasswordStrength(password: string): StrengthLevel {
  if (!password) return "empty";
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 1) return "weak";
  if (score <= 3) return "fair";
  return "strong";
}

const strengthConfig: Record<
  Exclude<StrengthLevel, "empty">,
  { label: string; color: string; bars: number }
> = {
  weak: { label: "Weak", color: "bg-destructive", bars: 1 },
  fair: { label: "Fair", color: "bg-yellow-500", bars: 2 },
  strong: { label: "Strong", color: "bg-green-500", bars: 3 },
};

function PasswordStrengthMeter({ password }: { password: string }) {
  const strength = getPasswordStrength(password);
  if (strength === "empty") return null;
  const cfg = strengthConfig[strength];
  return (
    <div className="mt-1.5 space-y-1">
      <div className="flex gap-1">
        {[1, 2, 3].map((bar) => (
          <div
            key={bar}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              bar <= cfg.bars ? cfg.color : "bg-muted"
            }`}
          />
        ))}
      </div>
      <p
        className={`text-xs font-medium ${
          strength === "weak"
            ? "text-destructive"
            : strength === "fair"
              ? "text-yellow-500"
              : "text-green-500"
        }`}
      >
        {cfg.label} password
      </p>
    </div>
  );
}

// ─── Component ─────────────────────────────────────────────────────────────
export function AuthDialog() {
  const { state, login, register } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  // Independent visibility states — one per field
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });

  // Real-time confirm password match state
  const passwordsMatch = useMemo(() => {
    if (!registerForm.confirmPassword) return null; // null = not yet typed
    return registerForm.password === registerForm.confirmPassword;
  }, [registerForm.password, registerForm.confirmPassword]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(loginForm.email, loginForm.password);
    if (success) {
      toast({
        title: `Welcome back!`,
        description: "You have been successfully logged in.",
        className: "bg-success-accent font-bold text-pure-white",
      });
      setIsOpen(false);
      setLoginForm({ email: "", password: "" });
      setShowLoginPassword(false);
    } else {
      toast({
        title: "Login failed",
        description: "Invalid email or password. ¿Are you already registered?",
        className: "bg-destructive font-bold text-pure-white",
      });
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (registerForm.password.length < 8) {
      toast({
        title: "Password too short",
        description: "Password must be at least 8 characters long.",
        className: "bg-destructive font-bold text-pure-white",
      });
      return;
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please make sure both passwords are the same.",
        className: "bg-destructive font-bold text-pure-white",
      });
      return;
    }

    const success = await register(
      registerForm.email,
      registerForm.password,
      registerForm.firstName,
      registerForm.lastName,
    );
    if (success) {
      toast({
        title: "Account created!",
        description: "Your account has been successfully created.",
        className: "bg-success-accent font-bold text-pure-white",
      });
      setIsOpen(false);
      setRegisterForm({
        email: "",
        password: "",
        confirmPassword: "",
        firstName: "",
        lastName: "",
      });
      setShowRegisterPassword(false);
      setShowConfirmPassword(false);
    } else {
      toast({
        title: "Registration failed",
        description: "An account with this email already exists.",
        className: "bg-destructive font-bold text-pure-white",
      });
    }
  };

  if (state.isAuthenticated) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <User className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Account</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 my-2">
            <TabsTrigger value="login" className="cursor-pointer">
              Login
            </TabsTrigger>
            <TabsTrigger value="register" className="cursor-pointer">
              Register
            </TabsTrigger>
          </TabsList>

          {/* ── LOGIN TAB ── */}
          <TabsContent value="login" className="space-y-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="login-email" className="mb-1">
                  Email
                </Label>
                <Input
                  id="login-email"
                  type="email"
                  value={loginForm.email}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, email: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="login-password" className="mb-1">
                  Password
                </Label>
                <Input
                  id="login-password"
                  type={showLoginPassword ? "text" : "password"}
                  value={loginForm.password}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, password: e.target.value })
                  }
                  required
                >
                  {showLoginPassword ? (
                    <Eye
                      onClick={() => setShowLoginPassword(false)}
                      className="cursor-pointer h-4 w-4 text-muted-foreground hover:text-foreground transition-colors"
                    />
                  ) : (
                    <EyeOff
                      onClick={() => setShowLoginPassword(true)}
                      className="cursor-pointer h-4 w-4 text-muted-foreground hover:text-foreground transition-colors"
                    />
                  )}
                </Input>
              </div>
              <Button
                type="submit"
                className="w-full cursor-pointer"
                disabled={state.isLoading}
              >
                <LogIn className="h-4 w-4 mr-2" />
                {state.isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
            <ul className="text-xs text-muted-foreground text-center">
              <li>Demo accounts:</li>
              <li>admin@example.com / password</li>
              <li>user@example.com / password</li>
            </ul>
          </TabsContent>

          {/* ── REGISTER TAB ── */}
          <TabsContent value="register" className="space-y-4">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="register-firstName" className="mb-1">
                    First Name
                  </Label>
                  <Input
                    id="register-firstName"
                    value={registerForm.firstName}
                    onChange={(e) =>
                      setRegisterForm({
                        ...registerForm,
                        firstName: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="register-lastName" className="mb-1">
                    Last Name
                  </Label>
                  <Input
                    id="register-lastName"
                    value={registerForm.lastName}
                    onChange={(e) =>
                      setRegisterForm({
                        ...registerForm,
                        lastName: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="register-email" className="mb-1">
                  Email
                </Label>
                <Input
                  id="register-email"
                  type="email"
                  value={registerForm.email}
                  onChange={(e) =>
                    setRegisterForm({ ...registerForm, email: e.target.value })
                  }
                  required
                />
              </div>

              {/* Password with strength meter */}
              <div>
                <Label htmlFor="register-password" className="mb-1">
                  Password
                </Label>
                <Input
                  id="register-password"
                  type={showRegisterPassword ? "text" : "password"}
                  value={registerForm.password}
                  onChange={(e) =>
                    setRegisterForm({
                      ...registerForm,
                      password: e.target.value,
                    })
                  }
                  required
                >
                  {showRegisterPassword ? (
                    <Eye
                      onClick={() => setShowRegisterPassword(false)}
                      className="cursor-pointer h-4 w-4 text-muted-foreground hover:text-foreground transition-colors"
                    />
                  ) : (
                    <EyeOff
                      onClick={() => setShowRegisterPassword(true)}
                      className="cursor-pointer h-4 w-4 text-muted-foreground hover:text-foreground transition-colors"
                    />
                  )}
                </Input>
                <PasswordStrengthMeter password={registerForm.password} />
              </div>

              {/* Confirm Password with real-time match feedback */}
              <div>
                <Label htmlFor="register-confirm-password" className="mb-1">
                  Confirm Password
                </Label>
                <Input
                  id="register-confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={registerForm.confirmPassword}
                  onChange={(e) =>
                    setRegisterForm({
                      ...registerForm,
                      confirmPassword: e.target.value,
                    })
                  }
                  className={
                    passwordsMatch === null
                      ? ""
                      : passwordsMatch
                        ? "border-green-500 focus-visible:border-green-500 focus-visible:ring-green-500/20"
                        : "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20"
                  }
                  required
                >
                  {showConfirmPassword ? (
                    <Eye
                      onClick={() => setShowConfirmPassword(false)}
                      className="cursor-pointer h-4 w-4 text-muted-foreground hover:text-foreground transition-colors"
                    />
                  ) : (
                    <EyeOff
                      onClick={() => setShowConfirmPassword(true)}
                      className="cursor-pointer h-4 w-4 text-muted-foreground hover:text-foreground transition-colors"
                    />
                  )}
                </Input>
                {passwordsMatch !== null && (
                  <p
                    className={`flex items-center gap-1 mt-1 text-xs font-medium ${
                      passwordsMatch ? "text-green-500" : "text-destructive"
                    }`}
                  >
                    {passwordsMatch ? (
                      <CheckCircle2 className="h-3 w-3" />
                    ) : (
                      <XCircle className="h-3 w-3" />
                    )}
                    {passwordsMatch
                      ? "Passwords match"
                      : "Passwords do not match"}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full cursor-pointer"
                disabled={state.isLoading || passwordsMatch === false}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                {state.isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
