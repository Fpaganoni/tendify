/**
 * WooCommerce data access layer.
 *
 * Strategy:
 *  1. If USE_MOCKS=true → always return mock data (fast local dev, no WP needed).
 *  2. If WooCommerce env vars are present → delegate filtering/searching to the
 *     WC REST API so the server does the work, not the client.
 *  3. If the API call fails for any reason → fall back to mock data silently so
 *     the UI never breaks.
 */

import axios, { AxiosError } from "axios";
import { WooCommerceProduct } from "./woocommerce-types";
import { mockProducts } from "../helpers/mock-products";

// ─── Environment helpers ──────────────────────────────────────────────────────

function getWCConfig() {
  const url = process.env.WORDPRESS_URL;
  const username = process.env.WP_USERNAME;
  const password = process.env.WP_APP_PASSWORD?.replace(/\s/g, "");
  return { url, username, password };
}

function isApiAvailable(): boolean {
  if (process.env.USE_MOCKS === "true") return false;
  const { url, username, password } = getWCConfig();
  return Boolean(url && username && password);
}

// ─── Query param types ────────────────────────────────────────────────────────

export interface WCProductParams {
  /** Full-text search delegated to WooCommerce */
  search?: string;
  /** Filter by WooCommerce numeric category ID */
  category?: number;
  /** Return only featured products */
  featured?: boolean;
  /** Pagination — max items per request (WC default: 10) */
  per_page?: number;
  /** Pagination — page number */
  page?: number;
  /** Field to order results by */
  orderby?: "date" | "id" | "include" | "title" | "slug" | "price" | "popularity" | "rating";
  /** Sort direction */
  order?: "asc" | "desc";
  /** Stock status filter */
  stock_status?: "instock" | "outofstock" | "onbackorder";
}

// ─── Core fetch helper ────────────────────────────────────────────────────────

/**
 * Generic WooCommerce REST API fetcher.
 * Returns `null` on any error so callers can fall back to mocks cleanly.
 */
async function wcFetch<T>(
  endpoint: string,
  params: Record<string, string | number | boolean> = {}
): Promise<T | null> {
  const { url, username, password } = getWCConfig();

  if (!url || !username || !password) return null;

  try {
    const response = await axios.get<T>(
      `${url}/wp-json/wc/v3/${endpoint}`,
      {
        params,
        auth: { username, password },
        headers: { "Content-Type": "application/json" },
        // Fail fast — don't hang the SSR render
        timeout: 8000,
      }
    );

    return response.data ?? null;
  } catch (error) {
    const axiosErr = error as AxiosError;
    console.warn(
      `[WooCommerce] ${axiosErr.message} — falling back to mock data.`,
      { endpoint, params }
    );
    return null;
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Fetch a list of products, optionally filtered/sorted by WooCommerce params.
 * Falls back to the full mock list if the API is unavailable.
 */
export async function getProducts(
  params: WCProductParams = {}
): Promise<WooCommerceProduct[]> {
  if (!isApiAvailable()) return mockProducts;

  const { featured, ...rest } = params;

  // WooCommerce expects booleans as strings in query params
  const wcParams: Record<string, string | number | boolean> = { ...rest };
  if (featured !== undefined) wcParams.featured = featured;

  const data = await wcFetch<WooCommerceProduct[]>("products", wcParams);
  return data ?? mockProducts;
}

/**
 * Fetch only featured products.
 * Uses `?featured=true` — no client-side filtering.
 */
export async function getFeaturedProducts(): Promise<WooCommerceProduct[]> {
  return getProducts({ featured: true, per_page: 20 });
}

/**
 * Fetch a single product by its WooCommerce numeric ID.
 * Uses the direct `/products/{id}` endpoint — no full list download.
 */
export async function getProductById(
  id: number
): Promise<WooCommerceProduct | null> {
  if (!isApiAvailable()) {
    return mockProducts.find((p) => p.id === id) ?? null;
  }

  const data = await wcFetch<WooCommerceProduct>(`products/${id}`);

  // Graceful fallback: try to find it in mocks if API returned nothing
  return data ?? mockProducts.find((p) => p.id === id) ?? null;
}

/**
 * Fetch products that belong to a specific category.
 *
 * @param categoryId - The **numeric** WooCommerce category ID.
 *   The WC REST API uses IDs, not slugs/names. If you need to resolve a
 *   category by name, use `getCategoryIdBySlug()` first.
 */
export async function getProductsByCategory(
  categoryId: number
): Promise<WooCommerceProduct[]> {
  return getProducts({ category: categoryId, per_page: 100 });
}

/**
 * Full-text product search delegated to WooCommerce.
 * The `?search` param searches across name, description, and SKU server-side.
 */
export async function searchProducts(
  query: string
): Promise<WooCommerceProduct[]> {
  if (!query.trim()) return getProducts();

  if (!isApiAvailable()) {
    const q = query.toLowerCase();
    return mockProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q)
    );
  }

  const data = await wcFetch<WooCommerceProduct[]>("products", {
    search: query,
    per_page: 50,
  });

  return data ?? [];
}

/**
 * Fetch all available product categories from WooCommerce.
 * Useful for building nav menus or filter UIs without hardcoding categories.
 */
export async function getCategories(): Promise<
  { id: number; name: string; slug: string; count: number }[]
> {
  if (!isApiAvailable()) {
    // Derive unique categories from mock products
    const seen = new Map<number, { id: number; name: string; slug: string; count: number }>();
    mockProducts.forEach((p) => {
      p.categories.forEach((c) => {
        const existing = seen.get(c.id);
        if (existing) {
          existing.count += 1;
        } else {
          seen.set(c.id, { ...c, count: 1 });
        }
      });
    });
    return Array.from(seen.values());
  }

  const data = await wcFetch<{ id: number; name: string; slug: string; count: number }[]>(
    "products/categories",
    { per_page: 100, hide_empty: true }
  );

  return data ?? [];
}

// Re-export mockProducts so other modules can import mocks directly from `@/lib/db`
export { mockProducts };
