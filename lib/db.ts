// Mock database functions for development
// In production, replace with actual database queries
import axios from "axios";

// export const mockProducts: Product[] = [
//   {
//     id: 1,
//     name: "Premium Wireless Headphones",
//     description:
//       "High-quality wireless headphones with noise cancellation and premium sound quality.",
//     prices: { price: "199,99" },
//     images: [
//       {
//         src: "https://ik.imagekit.io/p2ho5d9bi/Trendify/premium-wireless-headphones.png?updatedAt=1758028871437",
//         alt: "Premium Wireless Headphones",
//       },
//     ],
//     categories: [{ name: "Electronics" }],
//     stock_availability: { text: "In Stock", class: "in-stock" },
//     featured: { categories: { name: "Electronics" } },
//     // created_at: new Date().toISOString(),
//     // updated_at: new Date().toISOString(),
//   },
//   {
//     id: 2,
//     name: "Organic Cotton T-Shirt",
//     description:
//       "Comfortable and sustainable organic cotton t-shirt available in multiple colors.",
//     prices: { price: "29,99" },
//     images: [
//       {
//         src: "https://ik.imagekit.io/p2ho5d9bi/Trendify/organic-cotton-t-shirt.jpg?updatedAt=1758028869135",
//         alt: "organic cotton t-shirt",
//       },
//     ],
//     categories: [{ name: "Clothing" }],
//     stock_availability: { text: "In Stock", class: "in-stock" },
//     featured: { categories: { name: "Electronics" } },
//     // created_at: new Date().toISOString(),
//     // updated_at: new Date().toISOString(),
//   },
//   {
//     id: 3,
//     name: "Smart Fitness Watch",
//     description:
//       "Advanced fitness tracking with heart rate monitoring, GPS, and smartphone integration.",
//     prices: { price: "199.99" },
//     images: [
//       {
//         src: "https://ik.imagekit.io/p2ho5d9bi/Trendify/smart-fitness-watch.png?updatedAt=1758028869547",
//         alt: "Smart Fitness Watch",
//       },
//     ],
//     categories: [{ name: "Electronics" }],
//     stock_availability: { text: "In Stock", class: "in-stock" },
//     featured: { categories: { name: "Electronics" } },
//     // created_at: new Date().toISOString(),
//     // updated_at: new Date().toISOString(),
//   },
//   {
//     id: 4,
//     name: "Artisan Coffee Beans",
//     description:
//       "Premium single-origin coffee beans roasted to perfection for the ultimate coffee experience.",
//     prices: { price: "24,99" },
//     images: [
//       {
//         src: "https://ik.imagekit.io/p2ho5d9bi/Trendify/artisan-coffee-beans.jpg?updatedAt=1758028865675",
//         alt: "coffee beans roasted",
//       },
//     ],
//     categories: [{ name: "Food and Beverage" }],
//     stock_availability: { text: "In Stock", class: "in-stock" },
//     featured: { categories: { name: "Food and Beverage" } },
//     // created_at: new Date().toISOString(),
//     // updated_at: new Date().toISOString(),
//   },
//   {
//     id: 5,
//     name: "Minimalist Desk Lamp",
//     description:
//       "Modern LED desk lamp with adjustable brightness and sleek minimalist design.",
//     prices: { price: "89,99" },
//     images: [
//       {
//         src: "https://ik.imagekit.io/p2ho5d9bi/Trendify/minimalist-desk-lamp.png?updatedAt=1758028868739",
//         alt: "LED desk lamp",
//       },
//     ],
//     categories: [{ name: "Food and Office" }],
//     stock_availability: { text: "In Stock", class: "in-stock" },
//     featured: { categories: { name: "Home & Office" } },
//     // created_at: new Date().toISOString(),
//     // updated_at: new Date().toISOString(),
//   },
// {
//   id: 6,
//   name: "Eco-Friendly Water Bottle",
//   description:
//     "Sustainable stainless steel water bottle that keeps drinks cold for 24 hours.",
//   prices: { price: "34,99" },
//   image_url:
//     "https://ik.imagekit.io/p2ho5d9bi/Trendify/eco-friendly-water-bottle.png?updatedAt=1758028868886",
//   category: "Lifestyle",
//   stock_availability: { text: "In Stock", class: "in-stock" }
//   featured: false,
//   // created_at: new Date().toISOString(),
//   // updated_at: new Date().toISOString(),
// },
// {
//   id: 7,
//   name: "Wireless Charging Pad",
//   description:
//     "Fast wireless charging pad compatible with all Qi-enabled devices.",
//   prices: { price: "49,99" },
//   image_url:
//     "https://ik.imagekit.io/p2ho5d9bi/Trendify/wireless-charging-pad.png?updatedAt=1758028869942",
//   category: "Electronics",
//   stock_availability: { text: "In Stock", class: "in-stock" }
//   featured: false,
//   // created_at: new Date().toISOString(),
//   // updated_at: new Date().toISOString(),
// },
// {
//   id: 8,
//   name: "Luxury Skincare Set",
//   description:
//     "Complete skincare routine with natural ingredients for healthy, glowing skin.",
//   prices: { price: "129,99" },
//   image_url:
//     "https://ik.imagekit.io/p2ho5d9bi/Trendify/luxury-skincare-set.png?updatedAt=1758028869820",
//   category: "Beauty",
//   stock_availability: { text: "In Stock", class: "in-stock" }
//   featured: true,
//   // created_at: new Date().toISOString(),
//   // updated_at: new Date().toISOString(),
// },
// ];

import { WooCommerceProduct } from "./woocommerce-types";

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

    return response.data;
  } catch (error: any) {
    console.log("❌ Error details:", error.response?.data);
    throw new Error(
      `WooCommerce API Error: ${JSON.stringify(error.response?.data)}`
    );
  }
}

// export async function getProducts(): Promise<WooCommerceProduct[]> {
//   const WORDPRESS_URL = process.env.WORDPRESS_URL;
//   const CONSUMER_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY;
//   const CONSUMER_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET;

//   if (!WORDPRESS_URL || !CONSUMER_KEY || !CONSUMER_SECRET) {
//     throw new Error(
//       "Missing WooCommerce API credentials in environment variables"
//     );
//   }

//   try {
//     const resolve = await axios.get(`${WORDPRESS_URL}/wp-json/wc/v3/products`, {
//       headers: {
//         "Content-Type": "application/json",
//       },
//       auth: {
//         username: CONSUMER_KEY,
//         password: CONSUMER_SECRET,
//       },
//     });

//     if (!resolve) {
//       throw new Error("No response from WooCommerce API");
//     }

//     console.log("Products fetched from WooCommerce:", resolve.data);
//     return resolve.data;
//   } catch (error: unknown) {
//     console.log("Error fetching products:", error);
//     throw new Error("Error fetching products from WooCommerce API");
//   }
// }

export async function getFeaturedProducts(): Promise<WooCommerceProduct[]> {
  const allProducts = await getProducts();
  return allProducts.filter((product) => product.categories?.[0].name);

  // await new Promise((resolve) => setTimeout(resolve, 100));
  // return mockProducts.filter((product) => product.featured);
}

export async function getProductById(
  id: number
): Promise<WooCommerceProduct | null> {
  // await new Promise((resolve) => setTimeout(resolve, 100));

  const allProducts = await getProducts();

  return allProducts.find((product) => product.id === id) || null;
}

export async function getProductsByCategory(
  category: string
): Promise<WooCommerceProduct[]> {
  // await new Promise((resolve) => setTimeout(resolve, 100));

  const allProducts = await getProducts();

  return allProducts.filter(
    (product) => product.categories[0].name === category
  );
}

export async function searchProducts(
  query: string
): Promise<WooCommerceProduct[]> {
  // await new Promise((resolve) => setTimeout(resolve, 100));

  const allProducts = await getProducts();

  return allProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase())
  );
}
