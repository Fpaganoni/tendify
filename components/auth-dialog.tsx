"use client";

import type React from "react";

import { useState } from "react";
import { User, LogIn, UserPlus, Eye, EyeOff } from "lucide-react";
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

export function AuthDialog() {
  const [showPassword, setShowPassword] = useState(false);
  const { state, login, register } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });

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
    const success = await register(
      registerForm.email,
      registerForm.password,
      registerForm.firstName,
      registerForm.lastName
    );
    if (success) {
      toast({
        title: "Account created!",
        description: "Your account has been successfully created.",
        className: "bg-success-accent font-bold text-pure-white",
      });
      setIsOpen(false);
      setRegisterForm({ email: "", password: "", firstName: "", lastName: "" });
    } else {
      toast({
        title: "Registration failed",
        description: "An account with this email already exists.",
        className: "bg-destructive font-bold text-pure-white",
      });
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
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
            <TabsTrigger value="login" className="cursor-pointer ">
              Login
            </TabsTrigger>
            <TabsTrigger value="register" className="cursor-pointer ">
              Register
            </TabsTrigger>
          </TabsList>

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
                  type={showPassword ? "text" : "password"}
                  value={loginForm.password}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, password: e.target.value })
                  }
                  required
                >
                  {showPassword ? (
                    <Eye
                      onClick={handleTogglePassword}
                      className="cursor-pointer"
                    />
                  ) : (
                    <EyeOff
                      onClick={handleTogglePassword}
                      className="cursor-pointer"
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
            <p className="text-xs text-muted-foreground text-center">
              Demo: admin@example.com / password
            </p>
          </TabsContent>

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
              <div>
                <Label htmlFor="register-password" className="mb-1">
                  Password
                </Label>
                <Input
                  id="register-password"
                  type={showPassword ? "text" : "password"}
                  value={registerForm.password}
                  onChange={(e) =>
                    setRegisterForm({
                      ...registerForm,
                      password: e.target.value,
                    })
                  }
                  required
                >
                  {showPassword ? (
                    <Eye
                      onClick={handleTogglePassword}
                      className="cursor-pointer"
                    />
                  ) : (
                    <EyeOff
                      onClick={handleTogglePassword}
                      className="cursor-pointer"
                    />
                  )}
                </Input>
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={state.isLoading}
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
