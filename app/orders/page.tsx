"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { ShoppingBag, Package } from "lucide-react";
import Link from "next/link";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  date: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  status: string;
  coupon: string | null;
}

function getStatusVariant(status: string): "default" | "secondary" | "outline" {
  switch (status) {
    case "Delivered":
      return "default";
    case "Shipped":
      return "secondary";
    default:
      return "outline";
  }
}

export default function OrdersPage() {
  const { state } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);

  // Auth guard
  useEffect(() => {
    if (!state.isLoading && !state.isAuthenticated) {
      router.push("/");
    }
  }, [state.isLoading, state.isAuthenticated, router]);

  // Load orders from localStorage
  useEffect(() => {
    if (state.isAuthenticated && state.user) {
      try {
        const key = `orders_${state.user.id}`;
        const stored = JSON.parse(localStorage.getItem(key) ?? "[]");
        setOrders(stored);
      } catch {
        setOrders([]);
      }
    }
  }, [state.isAuthenticated, state.user]);

  if (state.isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container px-4 py-8">
          <div className="text-center text-muted-foreground">Loading...</div>
        </div>
      </div>
    );
  }

  if (!state.isAuthenticated) return null;

  return (
    <div className="min-h-screen">
      <Header />
      <div className="container px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-1">Your Orders</h1>
            <p className="text-muted-foreground text-sm">
              {orders.length > 0
                ? `${orders.length} order${orders.length > 1 ? "s" : ""} placed`
                : "No orders yet"}
            </p>
          </div>

          {orders.length === 0 ? (
            <Card>
              <CardContent className="text-center py-16">
                <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
                <p className="text-muted-foreground mb-6">
                  Start shopping to see your orders here!
                </p>
                <Button asChild>
                  <Link href="/products">
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Browse Products
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <CardTitle className="text-base font-semibold">
                        {order.id}
                      </CardTitle>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground">
                          {new Date(order.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                        <Badge variant={getStatusVariant(order.status)}>
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Order items */}
                    <div className="space-y-2">
                      {order.items.map((item, i) => (
                        <div
                          key={i}
                          className="flex justify-between items-center text-sm"
                        >
                          <div>
                            <span className="font-medium">{item.name}</span>
                            <span className="text-muted-foreground ml-1">
                              × {item.quantity}
                            </span>
                          </div>
                          <span>
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <Separator />

                    {/* Pricing breakdown */}
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between text-muted-foreground">
                        <span>Subtotal</span>
                        <span>${order.subtotal.toFixed(2)}</span>
                      </div>
                      {order.discount > 0 && (
                        <div className="flex justify-between text-green-500">
                          <span>
                            Discount {order.coupon ? `(${order.coupon})` : ""}
                          </span>
                          <span>-${order.discount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-muted-foreground">
                        <span>Shipping</span>
                        <span>
                          {order.shipping === 0
                            ? "FREE"
                            : `$${order.shipping.toFixed(2)}`}
                        </span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Tax</span>
                        <span>${order.tax.toFixed(2)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-semibold text-base pt-1">
                        <span>Total</span>
                        <span>${order.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
