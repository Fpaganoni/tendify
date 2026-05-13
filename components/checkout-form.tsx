"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Truck,
  MapPin,
  Tag,
  ChevronDown,
  CheckCircle2,
  XCircle,
  Lock,
} from "lucide-react";
import {
  loadStripe,
  type StripeElementsOptions,
  type Stripe,
} from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
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

// ─── Stripe singleton (loaded once, outside component to avoid re-renders) ───
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

// ─── Coupon codes ─────────────────────────────────────────────────────────────
const VALID_COUPONS: Record<
  string,
  { type: "percent" | "fixed"; value: number; label: string }
> = {
  SAVE10: { type: "percent", value: 10, label: "10% off" },
  FREESHIP: { type: "fixed", value: -1, label: "Free shipping" },
  WELCOME20: { type: "percent", value: 20, label: "20% off your first order" },
};

// ─── Types ────────────────────────────────────────────────────────────────────
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
}

interface CheckoutFormProps {
  onProcessingChange?: (isProcessing: boolean) => void;
}

// ─── Inner form — must live inside <Elements> to access Stripe hooks ──────────
function StripePaymentForm({
  formData,
  finalTotal,
  appliedCoupon,
  cartItems,
  customerId,
  onProcessingChange,
}: {
  formData: CheckoutFormData;
  finalTotal: number;
  appliedCoupon: { code: string; type: "percent" | "fixed"; value: number; label: string } | null;
  cartItems: { product: { id: number; name: string; price: string }; quantity: number }[];
  customerId?: number;
  onProcessingChange?: (v: boolean) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const { dispatch } = useCart();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    onProcessingChange?.(true);
    setPaymentError(null);

    // 1. Confirm the payment with Stripe
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (error) {
      setPaymentError(error.message ?? "Payment failed. Please try again.");
      setIsProcessing(false);
      onProcessingChange?.(false);
      return;
    }

    if (paymentIntent?.status !== "succeeded") {
      setPaymentError("Payment was not completed. Please try again.");
      setIsProcessing(false);
      onProcessingChange?.(false);
      return;
    }

    // 2. Create the WooCommerce order
    try {
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentIntentId: paymentIntent.id,
          customerId,
          billing: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            address_1: formData.address,
            city: formData.city,
            state: formData.state,
            postcode: formData.zipCode,
            country: formData.country,
          },
          shipping: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            address_1: formData.address,
            city: formData.city,
            state: formData.state,
            postcode: formData.zipCode,
            country: formData.country,
          },
          lineItems: cartItems.map((item) => ({
            product_id: item.product.id,
            quantity: item.quantity,
          })),
          shippingMethod: formData.shippingMethod,
          couponCode: appliedCoupon?.code ?? undefined,
        }),
      });
    } catch {
      // Non-blocking — payment succeeded, order creation failure is logged server-side
      console.warn("Order creation in WooCommerce failed — payment was successful.");
    }

    dispatch({ type: "CLEAR_CART" });
    router.push("/checkout/success");
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Payment Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Stripe's PaymentElement renders card fields + any enabled payment method */}
          <PaymentElement />
          {paymentError && (
            <p className="mt-3 flex items-center gap-1 text-sm text-destructive">
              <XCircle className="h-4 w-4 flex-shrink-0" />
              {paymentError}
            </p>
          )}
        </CardContent>
      </Card>

      <Button
        type="submit"
        className="w-full cursor-pointer"
        size="lg"
        disabled={!stripe || !elements || isProcessing}
        onClick={handleSubmit}
      >
        {isProcessing
          ? "Processing..."
          : `Complete Order — $${finalTotal.toFixed(2)}`}
      </Button>

      <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1">
        <Lock className="h-3 w-3" />
        Payments are encrypted and processed securely by Stripe.
      </p>
    </div>
  );
}

// ─── Outer form — handles shipping/address state + PaymentIntent lifecycle ────
export function CheckoutForm({ onProcessingChange }: CheckoutFormProps) {
  const { state: cartState } = useCart();
  const { state: authState } = useAuth();

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
  });

  const [couponInput, setCouponInput] = useState("");
  const [couponOpen, setCouponOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    type: "percent" | "fixed";
    value: number;
    label: string;
  } | null>(null);
  const [couponError, setCouponError] = useState("");

  // Stripe Elements state
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [piError, setPiError] = useState<string | null>(null);

  // Pre-fill from auth session
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

  // ── Pricing ────────────────────────────────────────────────────────────────
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

  // ── PaymentIntent — created/refreshed when the total changes ──────────────
  useEffect(() => {
    if (finalTotal <= 0) return;

    const amountInCents = Math.round(finalTotal * 100);

    fetch("/api/checkout/payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: amountInCents, currency: "usd" }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
          setPiError(null);
        } else {
          setPiError(data.error ?? "Could not initialise payment.");
        }
      })
      .catch(() => setPiError("Could not connect to payment service."));
  }, [finalTotal]);

  // ── Coupon handlers ────────────────────────────────────────────────────────
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

  const handleInputChange = (field: keyof CheckoutFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const elementsOptions: StripeElementsOptions = {
    clientSecret: clientSecret ?? undefined,
    appearance: { theme: "stripe" },
  };

  return (
    <div className="space-y-8">
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
                <Label htmlFor="email" className="mb-2">Email Address</Label>
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
                  <Label htmlFor="firstName" className="mb-2">First Name</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className="mb-2">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="phone" className="mb-2">Phone Number</Label>
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
                <Label htmlFor="address" className="mb-2">Street Address</Label>
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
                  <Label htmlFor="city" className="mb-2">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="state" className="mb-2">State</Label>
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
                  <Label htmlFor="zipCode" className="mb-2">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    value={formData.zipCode}
                    onChange={(e) => handleInputChange("zipCode", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="country" className="mb-2">Country</Label>
                  <Select
                    value={formData.country}
                    onValueChange={(value) => handleInputChange("country", value)}
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
                onValueChange={(value) => handleInputChange("shippingMethod", value)}
              >
                {[
                  { id: "standard",  label: "Standard Shipping",  days: "5-7 business days",  price: "$5.99" },
                  { id: "express",   label: "Express Shipping",   days: "2-3 business days",  price: "$15.99" },
                  { id: "overnight", label: "Overnight Shipping", days: "Next business day",  price: "$29.99" },
                ].map((option) => (
                  <div
                    key={option.id}
                    className="flex items-center space-x-2 p-3 border rounded-lg mb-2 last:mb-0"
                  >
                    <RadioGroupItem value={option.id} id={option.id} />
                    <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium">{option.label}</p>
                          <p className="text-sm text-muted-foreground">{option.days}</p>
                        </div>
                        <span className="font-medium">
                          {appliedCoupon?.value === -1 && option.id === formData.shippingMethod ? (
                            <>
                              <span className="text-green-500 line-through">{option.price}</span>
                              <span className="text-green-500 ml-1">FREE</span>
                            </>
                          ) : (
                            option.price
                          )}
                        </span>
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>
        </div>

        {/* ── Right Column — Order Summary + Payment ── */}
        <div className="lg:sticky lg:top-8 lg:h-fit space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Cart Items */}
              <div className="space-y-3">
                {cartState.items.map((item) => (
                  <div key={item.product.id} className="flex justify-between items-center">
                    <div className="flex-1">
                      <p className="font-medium text-sm line-clamp-1">{item.product.name}</p>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-medium">
                      ${(parseFloat(item.product.price) * item.quantity).toFixed(2)}
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
                      Coupon &ldquo;{appliedCoupon.code}&rdquo; applied — {appliedCoupon.label}
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
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleApplyCoupon())}
                        className="flex-1 text-sm h-9"
                      />
                      <Button type="button" size="sm" variant="outline" onClick={handleApplyCoupon}>
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
            </CardContent>
          </Card>

          {/* Payment section — rendered inside Stripe <Elements> */}
          {piError && (
            <p className="text-sm text-destructive text-center flex items-center justify-center gap-1">
              <XCircle className="h-4 w-4" />
              {piError} — payment unavailable.
            </p>
          )}

          {clientSecret ? (
            <Elements stripe={stripePromise} options={elementsOptions}>
              <StripePaymentForm
                formData={formData}
                finalTotal={finalTotal}
                appliedCoupon={appliedCoupon}
                cartItems={cartState.items}
                customerId={authState.user?.id}
                onProcessingChange={onProcessingChange}
              />
            </Elements>
          ) : (
            !piError && (
              <Button className="w-full" size="lg" disabled>
                Loading payment...
              </Button>
            )
          )}
        </div>
      </div>
    </div>
  );
}
