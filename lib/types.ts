import { WooCommerceProduct } from "./woocommerce-types";

type Categories = {
  id: number;
  name: string;
};
export interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  images: [{ src: string; alt: string }];
  categories: Categories[];
  featured: boolean;
  stock_quantity: number;
  date_created: string;
  date_modified: string;
}

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  product: Product;
}

export interface Order {
  id: number;
  user_id: number;
  total_amount: number;
  status: string;
  shipping_address: string;
  billing_address: string;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  product: Product;
}

// // Guard type para verificar si un producto está en stock
// export function isProductInStock(product: WooCommerceProduct): boolean {
//   return product.is_in_stock && product.is_purchasable;
// }

// // Guard type para verificar si un producto está en oferta
// export function isProductOnSale(product: WooCommerceProduct): boolean {
//   return (
//     product.on_sale &&
//     product.prices.sale_price !== product.prices.regular_price
//   );
// }
