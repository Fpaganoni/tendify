"use client";

import { useAuth } from "@/lib/auth-context";
import { format } from "date-fns";
import {
  MapPin,
  Calendar,
  Mail,
  Phone,
  Package,
  Heart,
  Star,
  Edit2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";

export default function UserProfilePage() {
  const { state } = useAuth();
  const { user, isAuthenticated } = state;

  if (!isAuthenticated || !user) {
    return null; // El middleware o useEffect deberían redirigir al login
  }

  const firstNameLetter = user.first_name.charAt(0).toUpperCase();
  const lastNameLetter = user.last_name.charAt(0).toUpperCase();
  const fullName = `${user.first_name} ${user.last_name}`;

  const createDateFormated = user.created_at
    ? format(new Date(user.created_at), "MMMM dd, yyyy")
    : "Recently joined";

  const stats = [
    {
      icon: Package,
      label: "Total Orders",
      value: "24", // Hardcoded para el UI por ahora
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      icon: Heart,
      label: "Wishlist Items",
      value: "12",
      color: "text-rose-500",
      bg: "bg-rose-500/10",
    },
    {
      icon: Star,
      label: "Reviews",
      value: "18",
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
  ];

  const recentOrders = [
    {
      id: "62",
      product: "Premium Wireless Headphones",
      date: "01-09-2025",
      status: "Processing",
      amount: "$299.99",
    },
    {
      id: "67",
      product: "Minimalist Desk Lamp",
      date: "18-07-2024",
      status: "Delivered",
      amount: "$89.99",
    },
    {
      id: "69",
      product: "Wireless Charging Pad",
      date: "18-07-2024",
      status: "Delivered",
      amount: "$49.99",
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div className="flex items-center gap-6">
          <Avatar className="w-24 h-24 border-4 border-background shadow-lg">
            <AvatarFallback className="bg-orange/20 text-orange text-2xl font-bold">
              {firstNameLetter}
              {lastNameLetter}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold">{fullName}</h1>
            <p className="text-muted-foreground">
              Member since {createDateFormated}
            </p>
          </div>
        </div>
        <Link href="/user/settings">
          <Button variant="outline" className="gap-2 cursor-pointer">
            <Edit2 size={16} />
            Edit Profile
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="border-none shadow-sm bg-muted/50">
              <CardContent className="p-6 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.bg}`}>
                  <Icon size={24} className={stat.color} />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm font-medium">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3 text-sm">
                <Mail className="text-muted-foreground mt-0.5" size={18} />
                <div>
                  <p className="font-medium">{user.email}</p>
                  <p className="text-muted-foreground text-xs">Email</p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <Phone className="text-muted-foreground mt-0.5" size={18} />
                <div>
                  <p className="font-medium">+1 (555) 123-4567</p>
                  <p className="text-muted-foreground text-xs">Phone</p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <MapPin className="text-muted-foreground mt-0.5" size={18} />
                <div>
                  <p className="font-medium">New York, USA</p>
                  <p className="text-muted-foreground text-xs">Location</p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <Calendar className="text-muted-foreground mt-0.5" size={18} />
                <div>
                  <p className="font-medium">{createDateFormated}</p>
                  <p className="text-muted-foreground text-xs">Joined</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>About Me</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Tech enthusiast and avid shopper. Love discovering new products and trends!
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Your latest purchases and their status.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg bg-muted/30 border border-border/50"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-semibold">#{order.id}</span>
                      <Badge
                        variant={order.status === "Delivered" ? "default" : "secondary"}
                        className={order.status === "Delivered" ? "bg-green-600/20 text-green-600 hover:bg-green-600/30 border-none" : "border-none"}
                      >
                        {order.status}
                      </Badge>
                    </div>
                    <p className="font-medium text-sm">{order.product}</p>
                    <p className="text-muted-foreground text-xs mt-1">{order.date}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-bold">{order.amount}</p>
                    <Link href="/user/orders">
                      <Button variant="ghost" size="sm" className="cursor-pointer">
                        View
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
              <div className="pt-2">
                <Link href="/user/orders">
                  <Button variant="outline" className="w-full cursor-pointer">
                    View All Orders
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
