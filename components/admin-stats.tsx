"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Package, ShoppingCart, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface StatsData {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  activeCustomers: number;
}

export function AdminStats() {
  const [statsData, setStatsData] = useState<StatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => {
        setStatsData(data);
      })
      .catch((err) => {
        console.error("Failed to fetch admin stats:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const stats = [
    {
      title: "Total Revenue",
      // Simple USD formatter
      value: statsData
        ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
            statsData.totalRevenue
          )
        : "$0.00",
      change: "Lifetime revenue",
      icon: DollarSign,
    },
    {
      title: "Orders",
      value: statsData ? statsData.totalOrders.toLocaleString() : "0",
      change: "Total orders placed",
      icon: ShoppingCart,
    },
    {
      title: "Products",
      value: statsData ? statsData.totalProducts.toLocaleString() : "0",
      change: "Published products",
      icon: Package,
    },
    {
      title: "Active Customers",
      value: statsData ? statsData.activeCustomers.toLocaleString() : "0",
      change: "Registered accounts",
      icon: Users,
    },
  ];

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-28 mb-2" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
