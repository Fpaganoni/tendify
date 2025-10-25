"use client";

import { AdminLayout } from "@/components/admin-layout";
import { AdminStats } from "@/components/admin-stats";
import { AdminProductTable } from "@/components/admin-product-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductMock } from "@/lib/mock-types";

export const mockProducts: ProductMock[] = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    description:
      "High-quality wireless headphones with noise cancellation and premium sound quality.",
    prices: { price: "199,99" },
    images: [
      {
        src: "https://ik.imagekit.io/p2ho5d9bi/Trendify/premium-wireless-headphones.png?updatedAt=1758028871437",
        alt: "Premium Wireless Headphones",
      },
    ],
    categories: [{ name: "Electronics" }],
    stock_availability: { text: "out of Stock", class: "out-of-stock" },
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Organic Cotton T-Shirt",
    description:
      "Comfortable and sustainable organic cotton t-shirt available in multiple colors.",
    prices: { price: "29,99" },
    images: [
      {
        src: "https://ik.imagekit.io/p2ho5d9bi/Trendify/organic-cotton-t-shirt.jpg?updatedAt=1758028869135",
        alt: "organic cotton t-shirt",
      },
    ],
    categories: [{ name: "Clothing" }],
    stock_availability: { text: "In Stock", class: "in-stock" },
    featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 3,
    name: "Smart Fitness Watch",
    description:
      "Advanced fitness tracking with heart rate monitoring, GPS, and smartphone integration.",
    prices: { price: "199.99" },
    images: [
      {
        src: "https://ik.imagekit.io/p2ho5d9bi/Trendify/smart-fitness-watch.png?updatedAt=1758028869547",
        alt: "Smart Fitness Watch",
      },
    ],
    categories: [{ name: "Electronics" }],
    stock_availability: { text: "In Stock", class: "in-stock" },
    featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 4,
    name: "Artisan Coffee Beans",
    description:
      "Premium single-origin coffee beans roasted to perfection for the ultimate coffee experience.",
    prices: { price: "24,99" },
    images: [
      {
        src: "https://ik.imagekit.io/p2ho5d9bi/Trendify/artisan-coffee-beans.jpg?updatedAt=1758028865675",
        alt: "coffee beans roasted",
      },
    ],
    categories: [{ name: "Food and Beverage" }],
    stock_availability: { text: "In Stock", class: "in-stock" },
    featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 5,
    name: "Minimalist Desk Lamp",
    description:
      "Modern LED desk lamp with adjustable brightness and sleek minimalist design.",
    prices: { price: "89,99" },
    images: [
      {
        src: "https://ik.imagekit.io/p2ho5d9bi/Trendify/minimalist-desk-lamp.png?updatedAt=1758028868739",
        alt: "LED desk lamp",
      },
    ],
    categories: [{ name: "Food and Office" }],
    stock_availability: { text: "In Stock", class: "in-stock" },
    featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 6,
    name: "Eco-Friendly Water Bottle",
    description:
      "Sustainable stainless steel water bottle that keeps drinks cold for 24 hours.",
    prices: { price: "34,99" },
    images: [
      {
        src: "https://ik.imagekit.io/p2ho5d9bi/Trendify/eco-friendly-water-bottle.png?updatedAt=1758028868886",
        alt: "LED desk lamp",
      },
    ],
    categories: [{ name: "Lifestyle" }],
    stock_availability: { text: "In Stock", class: "in-stock" },
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 7,
    name: "Wireless Charging Pad",
    description:
      "Fast wireless charging pad compatible with all Qi-enabled devices.",
    prices: { price: "49,99" },
    images: [
      {
        src: "https://ik.imagekit.io/p2ho5d9bi/Trendify/wireless-charging-pad.png?updatedAt=1758028869942",
        alt: "LED desk lamp",
      },
    ],
    categories: [{ name: "Electronics" }],
    stock_availability: { text: "In Stock", class: "in-stock" },
    featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 8,
    name: "Luxury Skincare Set",
    description:
      "Complete skincare routine with natural ingredients for healthy, glowing skin.",
    prices: { price: "129,99" },
    images: [
      {
        src: "https://ik.imagekit.io/p2ho5d9bi/Trendify/luxury-skincare-set.png?updatedAt=1758028869820",
        alt: "LED desk lamp",
      },
    ],
    categories: [{ name: "Beauty" }],
    stock_availability: { text: "In Stock", class: "in-stock" },
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to your admin dashboard
          </p>
        </div>

        <AdminStats />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    id: "ORD-001",
                    customer: "John Doe",
                    amount: "$299.99",
                    status: "Completed",
                  },
                  {
                    id: "ORD-002",
                    customer: "Jane Smith",
                    amount: "$129.99",
                    status: "Processing",
                  },
                  {
                    id: "ORD-003",
                    customer: "Bob Johnson",
                    amount: "$89.99",
                    status: "Shipped",
                  },
                  {
                    id: "ORD-004",
                    customer: "Alice Brown",
                    amount: "$199.99",
                    status: "Pending",
                  },
                ].map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{order.id}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.customer}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{order.amount}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Top Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Electronics", sales: 45, percentage: 65 },
                  { name: "Clothing", sales: 23, percentage: 35 },
                  { name: "Home & Office", sales: 18, percentage: 28 },
                  { name: "Beauty", sales: 12, percentage: 18 },
                ].map((category) => (
                  <div key={category.name} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{category.name}</span>
                      <span>{category.sales} sales</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${category.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <AdminProductTable products={mockProducts} />
      </div>
    </AdminLayout>
  );
}
