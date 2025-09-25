// WooCommerce API products types.
import { Product } from "./types";

export interface ProductImage {
  id: number;
  src: string;
  alt: string;
  name: string;
  sizes: string;
  srcset: string;
  thumbnail: string;
}

export interface ProductCategory {
  id: number;
  name: string;
  slug: string;
  link: string;
}

export interface AddToCartButton {
  text: string;
  description: string;
  single_text: string;
  url: string;
  minimum: number;
  maximum: number;
  multiple_of: number;
}

export interface ProductPrices {
  price: string;
  regular_price: string;
  sale_price: string;
  price_range: string | null;
  currency_code: string;
  currency_symbol: string;
  currency_prefix: string;
  currency_suffix: string;
  currency_decimal_separator: string;
  currency_thousand_separator: string;
  currency_minor_unit: number;
}

export interface StockAvailability {
  text: string;
  class: string;
}

export interface WooCommerceProduct {
  id: number;
  name: string;
  slug: string;
  parent: number;
  type: "simple" | "grouped" | "external" | "variable";
  sku: string;
  permalink: string;
  description: string;
  short_description: string;
  price_html: string;
  average_rating: string;
  review_count: number;
  on_sale: boolean;
  is_purchasable: boolean;
  is_in_stock: boolean;
  is_on_backorder: boolean;
  low_stock_remaining: number | null;
  sold_individually: boolean;
  has_options: boolean;
  variation: string;
  add_to_cart: AddToCartButton;
  images: ProductImage[];
  categories: ProductCategory[];
  tags: ProductCategory[];
  brands: ProductCategory[];
  attributes: any[];
  variations: any[];
  grouped_products: any[];
  prices: ProductPrices;
  stock_availability: StockAvailability;
  extensions: Record<string, any>; // for dynamic extentions
}

// types for API responses
export interface ProductsApiResponse {
  products: WooCommerceProduct[];
  total?: number;
  total_pages?: number;
  current_page?: number;
}

// Tipos de utilidad para casos específicos
export type ProductType = WooCommerceProduct["type"];
export type ProductId = WooCommerceProduct["id"];
export type ProductSlug = WooCommerceProduct["slug"];

// Función adaptadora
// export function mapWooCommerceToProduct(
//   wooProduct: WooCommerceProduct
// ): Product {
//   return {
//     id: wooProduct.id,
//     name: wooProduct.name,
//     price: parseFloat(wooProduct.prices.price) / 100, // WooCommerce guarda precios en centavos
//     description: wooProduct.description,
//     image_url: wooProduct.images[0]?.src || "",
//     category: wooProduct.categories[0]?.name || "",
//     stock_availability: wooProduct.stock_availability.class,
//     featured: wooProduct.categories[0].name,
//   };
// }
