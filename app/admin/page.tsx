"use client";

import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin-layout";
import { AdminStats } from "@/components/admin-stats";
import { AdminProductTable } from "@/components/admin-product-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { WooCommerceProduct } from "@/lib/woocommerce-types";

interface AdminOrder {
  id: number;
  customer_name: string;
  total: string;
  status: string;
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [products, setProducts] = useState<WooCommerceProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch Recent Orders and Products simultaneously
    Promise.all([
      fetch("/api/admin/orders").then((res) => res.json()),
      fetch("/api/products?per_page=5").then((res) => res.json()), // Just fetch the first 5 for the dashboard preview
    ])
      .then(([ordersData, productsData]) => {
        setOrders(ordersData);
        // We'll reuse the WooCommerceProduct type for the table now instead of ProductMock
        setProducts(productsData);
      })
      .catch((err) => console.error("Error loading admin data:", err))
      .finally(() => setIsLoading(false));
  }, []);

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
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.length === 0 ? (
                    <p className="text-center text-muted-foreground py-4">
                      No recent orders
                    </p>
                  ) : (
                    orders.slice(0, 5).map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <p className="font-medium">#{order.id}</p>
                          <p className="text-sm text-muted-foreground">
                            {order.customer_name}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${parseFloat(order.total).toFixed(2)}</p>
                          <p className="text-sm text-muted-foreground capitalize">
                            {order.status}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Top Categories</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Category stats could be loaded dynamically later.
                  For now, we keep the UI placeholder to maintain the design. */}
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

        {/* The AdminProductTable now expects WooCommerceProduct[] instead of ProductMock[] */}
        {isLoading ? (
          <Skeleton className="h-[400px] w-full" />
        ) : (
          <AdminProductTable products={products} />
        )}
      </div>
    </AdminLayout>
  );
}
