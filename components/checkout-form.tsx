"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  CreditCard,
  Truck,
  MapPin,
  Tag,
  ChevronDown,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";

// ─── Coupon codes ──────────────────────────────────────────────────────────
const VALID_COUPONS: Record<
  string,
  { type: "percent" | "fixed"; value: number; label: string }
> = {
  SAVE10: { type: "percent", value: 10, label: "10% off" },
  FREESHIP: { type: "fixed", value: -1, label: "Free shipping" }, // -1 = override shipping
  WELCOME20: { type: "percent", value: 20, label: "20% off your first order" },
};

// ─── Input mask helpers ───────────────────────────────────────────────────
function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return digits;
}

function formatCVV(value: string): string {
  return value.replace(/\D/g, "").slice(0, 4);
}

// ─── Types ────────────────────────────────────────────────────────────────
interface CheckoutFormData {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  shippingMethod: string;
  paymentMethod: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardName: string;
}

interface CheckoutFormProps {
  onProcessingChange?: (isProcessing: boolean) => void;
}

export function CheckoutForm({ onProcessingChange }: CheckoutFormProps) {
  const { state: cartState, dispatch } = useCart();
  const { state: authState } = useAuth();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  // Coupon state
  const [couponInput, setCouponInput] = useState("");
  const [couponOpen, setCouponOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    type: "percent" | "fixed";
    value: number;
    label: string;
  } | null>(null);
  const [couponError, setCouponError] = useState("");

  const [formData, setFormData] = useState<CheckoutFormData>({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US",
    phone: "",
    shippingMethod: "standard",
    paymentMethod: "card",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
  });

  // Pre-fill from auth state on mount
  useEffect(() => {
    if (authState.user) {
      setFormData((prev) => ({
        ...prev,
        email: authState.user!.email,
        firstName: authState.user!.first_name,
        lastName: authState.user!.last_name,
      }));
    }
  }, [authState.user]);

  const handleInputChange = (field: keyof CheckoutFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // ── Coupon logic ─────────────────────────────────────────────────────────
  const handleApplyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    const found = VALID_COUPONS[code];
    if (found) {
      setAppliedCoupon({ code, ...found });
      setCouponError("");
      setCouponInput("");
    } else {
      setCouponError("Invalid coupon code. Try SAVE10, FREESHIP or WELCOME20.");
      setAppliedCoupon(null);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError("");
  };

  // ── Pricing ───────────────────────────────────────────────────────────────
  const baseShipping =
    formData.shippingMethod === "express"
      ? 15.99
      : formData.shippingMethod === "overnight"
        ? 29.99
        : 5.99;

  const shippingCost =
    appliedCoupon?.type === "fixed" && appliedCoupon.value === -1
      ? 0
      : baseShipping;

  const subtotal = cartState.total;
  const tax = subtotal * 0.08;

  const discount =
    appliedCoupon?.type === "percent"
      ? (subtotal * appliedCoupon.value) / 100
      : 0;

  const finalTotal = subtotal - discount + shippingCost + tax;

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    onProcessingChange?.(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Save order to localStorage
    const order = {
      id: `ORD-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      items: cartState.items.map((item) => ({
        name: item.product.name,
        quantity: item.quantity,
        price: parseFloat(item.product.price),
      })),
      subtotal,
      discount,
      shipping: shippingCost,
      tax,
      total: finalTotal,
      status: "Processing",
      coupon: appliedCoupon?.code ?? null,
    };

    try {
      const userId = authState.user?.id ?? "guest";
      const key = `orders_${userId}`;
      const existing = JSON.parse(localStorage.getItem(key) ?? "[]");
      localStorage.setItem(key, JSON.stringify([order, ...existing]));
    } catch {
      // Non-blocking — order still processes
    }

    dispatch({ type: "CLEAR_CART" });
    router.push("/checkout/success");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ── Left Column ── */}
        <div className="space-y-6">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="email" className="mb-2">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className="mb-2">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className="mb-2">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="phone" className="mb-2">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="address" className="mb-2">
                  Street Address
                </Label>
                <Textarea
                  id="address"
                  maxLength={100}
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  required
                  className="max-h-32"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city" className="mb-2">
                    City
                  </Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="state" className="mb-2">
                    State
                  </Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="zipCode" className="mb-2">
                    ZIP Code
                  </Label>
                  <Input
                    id="zipCode"
                    value={formData.zipCode}
                    onChange={(e) =>
                      handleInputChange("zipCode", e.target.value)
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="country" className="mb-2">
                    Country
                  </Label>
                  <Select
                    value={formData.country}
                    onValueChange={(value) =>
                      handleInputChange("country", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="US">United States</SelectItem>
                      <SelectItem value="CA">Canada</SelectItem>
                      <SelectItem value="UK">United Kingdom</SelectItem>
                      <SelectItem value="ES">Spain</SelectItem>
                      <SelectItem value="AR">Argentina</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Method */}
          <Card>
            <CardHeader>
              <CardTitle>Shipping Method</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={formData.shippingMethod}
                onValueChange={(value) =>
                  handleInputChange("shippingMethod", value)
                }
              >
                {[
                  {
                    id: "standard",
                    label: "Standard Shipping",
                    days: "5-7 business days",
                    price: "$5.99",
                  },
                  {
                    id: "express",
                    label: "Express Shipping",
                    days: "2-3 business days",
                    price: "$15.99",
                  },
                  {
                    id: "overnight",
                    label: "Overnight Shipping",
                    days: "Next business day",
                    price: "$29.99",
                  },
                ].map((option) => (
                  <div
                    key={option.id}
                    className="flex items-center space-x-2 p-3 border rounded-lg mb-2 last:mb-0"
                  >
                    <RadioGroupItem value={option.id} id={option.id} />
                    <Label
                      htmlFor={option.id}
                      className="flex-1 cursor-pointer"
                    >
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium">{option.label}</p>
                          <p className="text-sm text-muted-foreground">
                            {option.days}
                          </p>
                        </div>
                        <span className="font-medium">
                          {appliedCoupon?.value === -1 &&
                          option.id === formData.shippingMethod ? (
                            <span className="text-green-500 line-through">
                              {option.price}
                            </span>
                          ) : (
                            option.price
                          )}
                          {appliedCoupon?.value === -1 &&
                            option.id === formData.shippingMethod && (
                              <span className="text-green-500 ml-1">FREE</span>
                            )}
                        </span>
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="cardName" className="mb-2">
                  Cardholder Name
                </Label>
                <Input
                  id="cardName"
                  value={formData.cardName}
                  onChange={(e) =>
                    handleInputChange("cardName", e.target.value)
                  }
                  placeholder="Name as it appears on card"
                  required
                />
              </div>
              <div>
                <Label htmlFor="cardNumber" className="mb-2">
                  Card Number
                </Label>
                <Input
                  id="cardNumber"
                  inputMode="numeric"
                  placeholder="1234 5678 9012 3456"
                  value={formData.cardNumber}
                  onChange={(e) =>
                    handleInputChange(
                      "cardNumber",
                      formatCardNumber(e.target.value),
                    )
                  }
                  maxLength={19}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiryDate" className="mb-2">
                    Expiry Date
                  </Label>
                  <Input
                    id="expiryDate"
                    inputMode="numeric"
                    placeholder="MM/YY"
                    value={formData.expiryDate}
                    onChange={(e) =>
                      handleInputChange(
                        "expiryDate",
                        formatExpiry(e.target.value),
                      )
                    }
                    maxLength={5}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="cvv" className="mb-2">
                    CVV
                  </Label>
                  <Input
                    id="cvv"
                    inputMode="numeric"
                    placeholder="123"
                    value={formData.cvv}
                    onChange={(e) =>
                      handleInputChange("cvv", formatCVV(e.target.value))
                    }
                    maxLength={4}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Right Column — Order Summary ── */}
        <div className="lg:sticky lg:top-8 lg:h-fit space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Cart Items */}
              <div className="space-y-3">
                {cartState.items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex justify-between items-center"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm line-clamp-1">
                        {item.product.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="font-medium">
                      $
                      {(parseFloat(item.product.price) * item.quantity).toFixed(
                        2,
                      )}
                    </span>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Coupon Code */}
              <div>
                <button
                  type="button"
                  onClick={() => setCouponOpen(!couponOpen)}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  <Tag className="h-4 w-4" />
                  {appliedCoupon ? (
                    <span className="text-green-500 font-medium">
                      Coupon "{appliedCoupon.code}" applied —{" "}
                      {appliedCoupon.label}
                    </span>
                  ) : (
                    "Add a coupon code"
                  )}
                  <ChevronDown
                    className={`h-3 w-3 transition-transform ${couponOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {couponOpen && !appliedCoupon && (
                  <div className="mt-2 space-y-2">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter coupon code"
                        value={couponInput}
                        onChange={(e) =>
                          setCouponInput(e.target.value.toUpperCase())
                        }
                        onKeyDown={(e) =>
                          e.key === "Enter" &&
                          (e.preventDefault(), handleApplyCoupon())
                        }
                        className="flex-1 text-sm h-9"
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={handleApplyCoupon}
                      >
                        Apply
                      </Button>
                    </div>
                    {couponError && (
                      <p className="flex items-center gap-1 text-xs text-destructive">
                        <XCircle className="h-3 w-3" />
                        {couponError}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Try: <span className="font-mono">SAVE10</span>,{" "}
                      <span className="font-mono">FREESHIP</span>,{" "}
                      <span className="font-mono">WELCOME20</span>
                    </p>
                  </div>
                )}

                {appliedCoupon && (
                  <div className="mt-2 flex items-center justify-between">
                    <p className="flex items-center gap-1 text-xs text-green-500">
                      <CheckCircle2 className="h-3 w-3" />
                      {appliedCoupon.label}
                    </p>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-xs text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              <Separator />

              {/* Pricing Breakdown */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-500">
                    <span>Discount ({appliedCoupon?.label})</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>
                    {shippingCost === 0 ? (
                      <span className="text-green-500">FREE</span>
                    ) : (
                      `$${shippingCost.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full cursor-pointer"
                size="lg"
                disabled={isProcessing}
              >
                {isProcessing
                  ? "Processing..."
                  : `Complete Order — $${finalTotal.toFixed(2)}`}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
