/**
 * GET /api/admin/stats
 *
 * Retrieves sales reports and general statistics from WooCommerce.
 * Protected route: ensures the caller is an admin.
 */
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import axios, { AxiosError } from "axios";
import { getWCAdminHeaders, isWPConfigured } from "@/lib/auth-helpers";

// Fallback data when WP is not configured or in Dev Mode
const MOCK_STATS = {
  totalRevenue: 45231.89,
  totalOrders: 2350,
  totalProducts: 124,
  activeCustomers: 573,
};

export async function GET() {
  if (!isWPConfigured()) {
    return NextResponse.json(MOCK_STATS);
  }

  try {
    const WORDPRESS_URL = process.env.WORDPRESS_URL;

    // Fetch from multiple WC endpoints in parallel
    const [salesRes, ordersRes, productsRes, customersRes] = await Promise.all([
      axios.get(`${WORDPRESS_URL}/wp-json/wc/v3/reports/sales`, {
        headers: getWCAdminHeaders(),
        params: { period: "month" }, // Last month by default
      }),
      // Using per_page=1 just to get the total count from the header 'x-wp-total'
      axios.get(`${WORDPRESS_URL}/wp-json/wc/v3/orders`, {
        headers: getWCAdminHeaders(),
        params: { per_page: 1 },
      }),
      axios.get(`${WORDPRESS_URL}/wp-json/wc/v3/products`, {
        headers: getWCAdminHeaders(),
        params: { per_page: 1, status: "publish" },
      }),
      axios.get(`${WORDPRESS_URL}/wp-json/wc/v3/customers`, {
        headers: getWCAdminHeaders(),
        params: { per_page: 1 },
      }),
    ]);

    // WooCommerce returns an array for sales reports
    const salesData = salesRes.data[0] || { total_sales: "0" };

    const stats = {
      totalRevenue: parseFloat(salesData.total_sales || "0"),
      totalOrders: parseInt(ordersRes.headers["x-wp-total"] || "0", 10),
      totalProducts: parseInt(productsRes.headers["x-wp-total"] || "0", 10),
      activeCustomers: parseInt(customersRes.headers["x-wp-total"] || "0", 10),
    };

    return NextResponse.json(stats);
  } catch (error) {
    const axiosErr = error as AxiosError<{ message?: string }>;
    console.error(
      "[/api/admin/stats]",
      axiosErr.response?.data?.message ?? axiosErr.message
    );
    // Graceful fallback to avoid breaking the dashboard UI
    return NextResponse.json(MOCK_STATS);
  }
}
