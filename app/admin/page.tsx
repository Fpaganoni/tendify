"use client"

import { AdminLayout } from "@/components/admin-layout"
import { AdminStats } from "@/components/admin-stats"
import { AdminProductTable } from "@/components/admin-product-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { mockProducts } from "@/lib/db"

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your admin dashboard</p>
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
                  { id: "ORD-001", customer: "John Doe", amount: "$299.99", status: "Completed" },
                  { id: "ORD-002", customer: "Jane Smith", amount: "$129.99", status: "Processing" },
                  { id: "ORD-003", customer: "Bob Johnson", amount: "$89.99", status: "Shipped" },
                  { id: "ORD-004", customer: "Alice Brown", amount: "$199.99", status: "Pending" },
                ].map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{order.id}</p>
                      <p className="text-sm text-muted-foreground">{order.customer}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{order.amount}</p>
                      <p className="text-sm text-muted-foreground">{order.status}</p>
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
                      <div className="bg-primary h-2 rounded-full" style={{ width: `${category.percentage}%` }} />
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
  )
}
