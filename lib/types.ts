export interface Product {
  id: number
  name: string
  description: string
  price: number
  image_url: string
  category: string
  stock_quantity: number
  featured: boolean
  created_at: string
  updated_at: string
}

export interface User {
  id: number
  email: string
  first_name: string
  last_name: string
  role: string
  created_at: string
  updated_at: string
}

export interface CartItem {
  id: number
  user_id: number
  product_id: number
  quantity: number
  product: Product
}

export interface Order {
  id: number
  user_id: number
  total_amount: number
  status: string
  shipping_address: string
  billing_address: string
  created_at: string
  updated_at: string
  items: OrderItem[]
}

export interface OrderItem {
  id: number
  order_id: number
  product_id: number
  quantity: number
  price: number
  product: Product
}
