// Mock database functions for development
// In production, replace with actual database queries
import axios from "axios";
import { WooCommerceProduct } from "./woocommerce-types";
import { mockProducts } from "../helpers/mock-products";

// funcion debugger
export async function getProducts(): Promise<WooCommerceProduct[]> {
  const WORDPRESS_URL = process.env.WORDPRESS_URL;
  const WP_USERNAME = process.env.WP_USERNAME; // Tu usuario de WordPress
  const WP_APP_PASSWORD = process.env.WP_APP_PASSWORD; // La contraseña que acabas de generar

  console.log("🔍 Using Application Password authentication");
  console.log("Username:", WP_USERNAME);
  console.log("Password exists:", !!WP_APP_PASSWORD);

  if (!WORDPRESS_URL || !WP_USERNAME || !WP_APP_PASSWORD) {
    throw new Error("Missing required environment variables");
  }

  try {
    const url = `${WORDPRESS_URL}/wp-json/wc/v3/products`;

    console.log("🌐 Making request to:", url);

    // Quitar espacios de la contraseña de aplicación
    const cleanPassword = WP_APP_PASSWORD.replace(/\s/g, "");

    const response = await axios.get(url, {
      auth: {
        username: WP_USERNAME,
        password: cleanPassword,
      },
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("✅ Response status:", response.status);
    console.log("📦 Products found:", response.data?.length || 0);

    if (!response) {
      return mockProducts;
    }

    return response.data;
  } catch (error: any) {
    console.log("❌ Error details:", error.response?.data);
    throw new Error(
      `WooCommerce API Error: ${JSON.stringify(error.response?.data)}`
    );
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
