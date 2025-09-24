// Mock database functions for development
// In production, replace with actual database queries
import axios from "axios";

export const mockProducts: Product[] = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    description:
      "High-quality wireless headphones with noise cancellation and premium sound quality.",
    price: 299.99,
    image_url:
      "https://ik.imagekit.io/p2ho5d9bi/Trendify/premium-wireless-headphones.png?updatedAt=1758028871437",
    category: "Electronics",
    stock_quantity: 50,
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Organic Cotton T-Shirt",
    description:
      "Comfortable and sustainable organic cotton t-shirt available in multiple colors.",
    price: 29.99,
    image_url:
      "https://ik.imagekit.io/p2ho5d9bi/Trendify/organic-cotton-t-shirt.jpg?updatedAt=1758028869135",
    category: "Clothing",
    stock_quantity: 100,
    featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 3,
    name: "Smart Fitness Watch",
    description:
      "Advanced fitness tracking with heart rate monitoring, GPS, and smartphone integration.",
    price: 199.99,
    image_url:
      "https://ik.imagekit.io/p2ho5d9bi/Trendify/smart-fitness-watch.png?updatedAt=1758028869547",
    category: "Electronics",
    stock_quantity: 75,
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 4,
    name: "Artisan Coffee Beans",
    description:
      "Premium single-origin coffee beans roasted to perfection for the ultimate coffee experience.",
    price: 24.99,
    image_url:
      "https://ik.imagekit.io/p2ho5d9bi/Trendify/artisan-coffee-beans.jpg?updatedAt=1758028865675",
    category: "Food & Beverage",
    stock_quantity: 200,
    featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 5,
    name: "Minimalist Desk Lamp",
    description:
      "Modern LED desk lamp with adjustable brightness and sleek minimalist design.",
    price: 89.99,
    image_url:
      "https://ik.imagekit.io/p2ho5d9bi/Trendify/minimalist-desk-lamp.png?updatedAt=1758028868739",
    category: "Home & Office",
    stock_quantity: 30,
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 6,
    name: "Eco-Friendly Water Bottle",
    description:
      "Sustainable stainless steel water bottle that keeps drinks cold for 24 hours.",
    price: 34.99,
    image_url:
      "https://ik.imagekit.io/p2ho5d9bi/Trendify/eco-friendly-water-bottle.png?updatedAt=1758028868886",
    category: "Lifestyle",
    stock_quantity: 150,
    featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 7,
    name: "Wireless Charging Pad",
    description:
      "Fast wireless charging pad compatible with all Qi-enabled devices.",
    price: 49.99,
    image_url:
      "https://ik.imagekit.io/p2ho5d9bi/Trendify/wireless-charging-pad.png?updatedAt=1758028869942",
    category: "Electronics",
    stock_quantity: 80,
    featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 8,
    name: "Luxury Skincare Set",
    description:
      "Complete skincare routine with natural ingredients for healthy, glowing skin.",
    price: 129.99,
    image_url:
      "https://ik.imagekit.io/p2ho5d9bi/Trendify/luxury-skincare-set.png?updatedAt=1758028869820",
    category: "Beauty",
    stock_quantity: 40,
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

import type { Product } from "./types";

export async function getProducts(): Promise<Product[]> {
  // Simulate API delay
  // await new Promise((resolve) => setTimeout(resolve, 100));
  // return mockProducts;

  // http://localhost/trendify

  const WORDPRESS_URL = "http://localhost/trendify";
  const WOOCOMMERCE_CONSUMER_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY;
  const WOOCOMMERCE_CONSUMER_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET;

  // if (!WOOCOMMERCE_CONSUMER_KEY || !WOOCOMMERCE_CONSUMER_SECRET) {
  //   throw new Error("WooCommerce API keys are not defined in .env.local");
  // }

  try {
    const response = await axios.get(
      `${WORDPRESS_URL}/wp-json/wc/store/products`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
      // {
      //   auth: {
      //     username: WOOCOMMERCE_CONSUMER_KEY,
      //     password: WOOCOMMERCE_CONSUMER_SECRET,
      //   },
      // }
    );
    console.log("Fetched products:", response.data);
    if (!response.data) {
      throw new Error("No data found");
    }
    return response.data;
  } catch (error: unknown) {
    console.log("Error fetching data", error);
    throw new Error("Failed to fetch products");
  }
}

export async function getFeaturedProducts(): Promise<Product[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return mockProducts.filter((product) => product.featured);
}

export async function getProductById(id: number): Promise<Product | null> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return mockProducts.find((product) => product.id === id) || null;
}

export async function getProductsByCategory(
  category: string
): Promise<Product[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return mockProducts.filter((product) => product.category === category);
}

export async function searchProducts(query: string): Promise<Product[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return mockProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase())
  );
}
