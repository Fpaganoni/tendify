/**
 * GET /api/admin/orders
 *
 * Retrieves recent orders for the admin dashboard.
 */
import { NextResponse } from "next/server";
import axios, { AxiosError } from "axios";
import { getWCAdminHeaders, isWPConfigured } from "@/lib/auth-helpers";

// Fallback data when WP is not configured or in Dev Mode
const MOCK_ORDERS = [
  { id: 1001, customer_name: "John Doe", total: "299.99", status: "completed" },
  { id: 1002, customer_name: "Jane Smith", total: "129.99", status: "processing" },
  { id: 1003, customer_name: "Bob Johnson", total: "89.99", status: "on-hold" },
  { id: 1004, customer_name: "Alice Brown", total: "199.99", status: "pending" },
];

export async function GET(request: Request) {
  if (!isWPConfigured()) {
    return NextResponse.json(MOCK_ORDERS);
  }

  try {
    const { searchParams } = new URL(request.url);
    const perPage = searchParams.get("per_page") || "10";

    const WORDPRESS_URL = process.env.WORDPRESS_URL;

    const response = await axios.get(`${WORDPRESS_URL}/wp-json/wc/v3/orders`, {
      headers: getWCAdminHeaders(),
      params: { per_page: perPage, orderby: "date", order: "desc" },
    });

    // Map WooCommerce Order to a simpler structure for the admin table
    const orders = response.data.map((order: any) => ({
      id: order.id,
      customer_name: `${order.billing.first_name} ${order.billing.last_name}`.trim() || "Guest",
      total: order.total,
      status: order.status,
    }));

    return NextResponse.json(orders);
  } catch (error) {
    const axiosErr = error as AxiosError<{ message?: string }>;
    console.error(
      "[/api/admin/orders]",
      axiosErr.response?.data?.message ?? axiosErr.message
    );
    return NextResponse.json(MOCK_ORDERS);
  }
}
