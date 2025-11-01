// Mock database functions for development
// In production, replace with actual database queries
import axios from "axios";
import { WooCommerceProduct } from "./woocommerce-types";
import { mockProducts } from "../helpers/mock-products";

export async function getProducts(): Promise<WooCommerceProduct[]> {
  // Si USE_MOCKS está configurado como "true", siempre usar datos mock
  if (process.env.USE_MOCKS === "true") {
    return mockProducts;
  }

  const WORDPRESS_URL = process.env.WORDPRESS_URL;
  const WP_USERNAME = process.env.WP_USERNAME;
  const WP_APP_PASSWORD = process.env.WP_APP_PASSWORD;

  if (!WORDPRESS_URL || !WP_USERNAME || !WP_APP_PASSWORD) {
    return mockProducts;
  }

  const url = `${WORDPRESS_URL}/wp-json/wc/v3/products`;
  const cleanPassword = WP_APP_PASSWORD.replace(/\s/g, "");

  try {
    const response = await axios.get(url, {
      auth: {
        username: WP_USERNAME,
        password: cleanPassword,
      },
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response?.data) {
      return mockProducts;
    }

    return response.data;
  } catch (error) {
    return mockProducts;
  }
}

export async function getFeaturedProducts(): Promise<WooCommerceProduct[]> {
  const allProducts = await getProducts();
  return allProducts.filter((product) => product.categories?.[0].name);
}

export async function getProductById(
  id: number
): Promise<WooCommerceProduct | null> {
  const allProducts = await getProducts();
  return allProducts.find((product) => product.id === id) || null;
}

export async function getProductsByCategory(
  category: string
): Promise<WooCommerceProduct[]> {
  const allProducts = await getProducts();
  return allProducts.filter(
    (product) => product.categories[0].name === category
  );
}

export async function searchProducts(
  query: string
): Promise<WooCommerceProduct[]> {
  const allProducts = await getProducts();
  return allProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase())
  );
}

// Re-export mockProducts so other modules can import mocks from `@/lib/db`
export { mockProducts };
