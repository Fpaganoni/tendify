/**
 * POST /api/checkout/payment-intent
 *
 * Creates a Stripe PaymentIntent server-side (secret key never leaves the server).
 * The client receives the `clientSecret` and uses it to confirm the payment
 * via Stripe.js — following Stripe's recommended server-client split.
 *
 * Body: { amount: number (in smallest currency unit, e.g. cents), currency?: string }
 */
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-04-22.dahlia",
  });

  try {
    const { amount, currency = "usd" } = await request.json();

    if (!amount || typeof amount !== "number" || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid amount. Must be a positive number (in cents)." },
        { status: 400 },
      );
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // Stripe requires integer cents
      currency,
      // automatic_payment_methods enables cards + all future Stripe methods
      automatic_payment_methods: { enabled: true },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    const message =
      error instanceof Stripe.errors.StripeError
        ? error.message
        : "Internal server error";

    console.error("[/api/checkout/payment-intent]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
