"use client";

import React, { useState } from "react";
import {
  Search,
  Download,
  Eye,
  Package,
  Truck,
  CheckCircle,
  Clock,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function OrdersDetails() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const orders = [
    {
      id: "576",
      date: "01-06-2024",
      product: "Eco-Friendly Water Bottle",
      quantity: 1,
      status: "Delivered",
      total: "$34.99",
    },
    {
      id: "526",
      date: "15-05-2024",
      product: "Organic Cotton T-Shirt",
      quantity: 2,
      status: "Delivered",
      total: "$59.99",
    },
    {
      id: "69",
      date: "18-07-2024",
      product: "Wireless Charging Pad",
      quantity: 1,
      status: "Shipped",
      total: "$49.99",
    },
    {
      id: "67",
      date: "18-07-2024",
      product: "Minimalist Desk Lamp",
      quantity: 1,
      status: "Processing",
      total: "$89.99",
    },
    {
      id: "62",
      date: "01-09-2025",
      product: "Premium Wireless Headphones",
      quantity: 1,
      status: "Processing",
      total: "$299.99",
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Processing":
        return <Clock size={14} className="mr-1" />;
      case "Shipped":
        return <Truck size={14} className="mr-1" />;
      case "Delivered":
        return <CheckCircle size={14} className="mr-1" />;
      default:
        return <Package size={14} className="mr-1" />;
    }
  };

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case "Processing":
        return "secondary";
      case "Shipped":
        return "outline";
      case "Delivered":
        return "default";
      default:
        return "outline";
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.includes(searchTerm);
    const matchesFilter =
      filterStatus === "all" ||
      order.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Order History</h1>
        <p className="text-muted-foreground">Track and manage all your past orders</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            type="text"
            placeholder="Search by order ID or product..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex w-full md:w-auto gap-3">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" className="gap-2 cursor-pointer">
            <Download size={16} />
            <span className="hidden md:inline">Export</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-none shadow-sm bg-muted/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Total Orders</p>
                <p className="text-2xl font-bold">{orders.length}</p>
              </div>
              <Package className="text-blue-500" size={32} />
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-muted/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Processing</p>
                <p className="text-2xl font-bold">
                  {orders.filter((o) => o.status === "Processing").length}
                </p>
              </div>
              <Clock className="text-amber-500" size={32} />
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-muted/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Shipped</p>
                <p className="text-2xl font-bold">
                  {orders.filter((o) => o.status === "Shipped").length}
                </p>
              </div>
              <Truck className="text-indigo-500" size={32} />
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-muted/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Total Spent</p>
                <p className="text-2xl font-bold">$534.95</p>
              </div>
              <CheckCircle className="text-green-500" size={32} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="border rounded-lg overflow-hidden bg-background">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="w-[100px] font-semibold">Order ID</TableHead>
              <TableHead className="font-semibold">Date</TableHead>
              <TableHead className="font-semibold">Product</TableHead>
              <TableHead className="text-center font-semibold">Qty</TableHead>
              <TableHead className="text-center font-semibold">Status</TableHead>
              <TableHead className="text-right font-semibold">Total</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium text-muted-foreground">#{order.id}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell className="font-medium">{order.product}</TableCell>
                  <TableCell className="text-center">{order.quantity}</TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={getBadgeVariant(order.status) as any}
                      className={`
                        flex w-fit mx-auto items-center
                        ${order.status === "Delivered" ? "bg-green-600/20 text-green-600 hover:bg-green-600/30 border-none" : ""}
                        ${order.status === "Processing" ? "bg-amber-500/20 text-amber-600 hover:bg-amber-500/30 border-none" : ""}
                        ${order.status === "Shipped" ? "bg-blue-500/20 text-blue-600 hover:bg-blue-500/30 border-none" : ""}
                      `}
                    >
                      {getStatusIcon(order.status)}
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-bold">{order.total}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="cursor-pointer">
                      <Eye size={18} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-48 text-center">
                  <Package className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                  <p className="text-lg font-medium text-muted-foreground">No orders found</p>
                  <p className="text-sm text-muted-foreground/80 mt-1">
                    Try adjusting your search or filters
                  </p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {filteredOrders.length > 0 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <p>
            Showing <span className="font-medium text-foreground">{filteredOrders.length}</span> of{" "}
            <span className="font-medium text-foreground">{orders.length}</span> orders
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
