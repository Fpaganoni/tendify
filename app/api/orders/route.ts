/**
 * POST /api/orders
 *
 * Creates an order in WooCommerce after a successful Stripe payment.
 * Acts as a secure proxy — WC credentials never reach the client.
 *
 * Body: {
 *   paymentIntentId: string   — Stripe PaymentIntent ID for cross-reference
 *   customerId?: number       — WooCommerce customer ID (if authenticated)
 *   billing: WCBillingAddress
 *   shipping: WCShippingAddress
 *   lineItems: WCLineItem[]
 *   shippingMethod: string
 *   couponCode?: string
 * }
 */
import { NextResponse } from "next/server";
import axios, { AxiosError } from "axios";

interface WCBillingAddress {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address_1: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
}

interface WCLineItem {
  product_id: number;
  quantity: number;
}

interface CreateOrderBody {
  paymentIntentId: string;
  customerId?: number;
  billing: WCBillingAddress;
  shipping: Omit<WCBillingAddress, "email" | "phone">;
  lineItems: WCLineItem[];
  shippingMethod: string;
  couponCode?: string;
}

function getWCAuthHeaders() {
  const username = process.env.WP_USERNAME!;
  const password = process.env.WP_APP_PASSWORD!.replace(/\s/g, "");
  const encoded = Buffer.from(`${username}:${password}`).toString("base64");
  return { Authorization: `Basic ${encoded}` };
}

const WC_SHIPPING_LINE_MAP: Record<string, { method_id: string; method_title: string; total: string }> = {
  standard:  { method_id: "flat_rate", method_title: "Standard Shipping",  total: "5.99" },
  express:   { method_id: "flat_rate", method_title: "Express Shipping",   total: "15.99" },
  overnight: { method_id: "flat_rate", method_title: "Overnight Shipping", total: "29.99" },
};

export async function POST(request: Request) {
  const WORDPRESS_URL = process.env.WORDPRESS_URL;

  if (!WORDPRESS_URL || !process.env.WP_USERNAME || !process.env.WP_APP_PASSWORD) {
    // In mock/dev mode without WP, return a fake order confirmation
    return NextResponse.json({
      id: Math.floor(Math.random() * 9000) + 1000,
      status: "processing",
      note: "Mock order — WooCommerce not configured",
    });
  }

  try {
    const body: CreateOrderBody = await request.json();
    const {
      paymentIntentId,
      customerId,
      billing,
      shipping,
      lineItems,
      shippingMethod,
      couponCode,
    } = body;

    const shippingLine = WC_SHIPPING_LINE_MAP[shippingMethod] ?? WC_SHIPPING_LINE_MAP.standard;

    const wcOrderPayload = {
      status: "processing",
      customer_id: customerId ?? 0,
      billing,
      shipping,
      line_items: lineItems,
      shipping_lines: [shippingLine],
      ...(couponCode ? { coupon_lines: [{ code: couponCode }] } : {}),
      meta_data: [
        { key: "_stripe_payment_intent", value: paymentIntentId },
      ],
    };

    const response = await axios.post(
      `${WORDPRESS_URL}/wp-json/wc/v3/orders`,
      wcOrderPayload,
      {
        headers: {
          ...getWCAuthHeaders(),
          "Content-Type": "application/json",
        },
        timeout: 10000,
      }
    );

    return NextResponse.json({ id: response.data.id, status: response.data.status });
  } catch (error) {
    const axiosErr = error as AxiosError<{ message?: string }>;
    const message = axiosErr.response?.data?.message ?? axiosErr.message ?? "Failed to create order";
    console.error("[/api/orders]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
