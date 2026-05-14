export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getProducts, searchProducts, type WCProductParams } from "@/lib/db";

/**
 * GET /api/products
 *
 * Supported query params (all optional):
 *   search       - full-text search string
 *   category     - numeric WooCommerce category ID
 *   featured     - "true" | "false"
 *   per_page     - number of results (default: 20)
 *   page         - page number for pagination
 *   orderby      - field to sort by
 *   order        - "asc" | "desc"
 *   stock_status - "instock" | "outofstock" | "onbackorder"
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search");

    // Delegate full-text search to its own optimised function
    if (search) {
      const products = await searchProducts(search);
      return NextResponse.json(products);
    }

    // Build typed params from the query string
    const params: WCProductParams = {};

    const category = searchParams.get("category");
    if (category) params.category = parseInt(category, 10);

    const featured = searchParams.get("featured");
    if (featured) params.featured = featured === "true";

    const per_page = searchParams.get("per_page");
    if (per_page) params.per_page = parseInt(per_page, 10);

    const page = searchParams.get("page");
    if (page) params.page = parseInt(page, 10);

    const orderby = searchParams.get("orderby") as WCProductParams["orderby"];
    if (orderby) params.orderby = orderby;

    const order = searchParams.get("order") as WCProductParams["order"];
    if (order) params.order = order;

    const stock_status = searchParams.get("stock_status") as WCProductParams["stock_status"];
    if (stock_status) params.stock_status = stock_status;

    const products = await getProducts(params);
    return NextResponse.json(products);
  } catch (error) {
    console.error("[/api/products] Unexpected error:", error);
    return NextResponse.json(
      { error: "Failed to load products" },
      { status: 500 }
    );
  }
}
