"use client";

import React, { useState } from "react";
import {
  Search,
  Filter,
  Download,
  Eye,
  Package,
  Truck,
  CheckCircle,
  Clock,
} from "lucide-react";

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
      statusColor: "blue",
    },
    {
      id: "526",
      date: "15-05-2024",
      product: "Organic Cotton T-Shirt",
      quantity: 2,
      status: "Delivered",
      total: "$59.99",
      statusColor: "blue",
    },
    {
      id: "69",
      date: "18-07-2024",
      product: "Wireless Charging Pad",
      quantity: 1,
      status: "Shipped",
      total: "$49.99",
      statusColor: "blue",
    },
    {
      id: "67",
      date: "18-07-2024",
      product: "Minimalist Desk Lamp",
      quantity: 1,
      status: "Processing",
      total: "$89.99",
      statusColor: "blue",
    },
    {
      id: "62",
      date: "01-09-2025",
      product: "Premium Wireless Headphones",
      quantity: 1,
      status: "Processing",
      total: "$299.99",
      statusColor: "yellow",
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Processing":
        return <Clock size={16} />;
      case "Shipped":
        return <Truck size={16} />;
      case "Delivered":
        return <CheckCircle size={16} />;
      default:
        return <Package size={16} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Processing":
        return "bg-alert text-primary border-alert";
      case "Shipped":
        return "bg-light-blue text-primary border-light-blue";
      case "Delivered":
        return "bg-green-check text-primary border-green-check";
      default:
        return "bg-light-blue text-primary border-ight-blue";
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
    <div className="min-h-screen bg-background text-primary p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Your orders details here!</h1>
          <p className="text-primary/80">Track and manage all your orders</p>
        </div>

        {/* Filters and Search */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative ">
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 "
              size={20}
            />
            <input
              type="text"
              placeholder="Search by order ID or product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-muted bg-opacity-50 placeholder-primary/85 backdrop-blur-lg ring-1 ring-primary rounded-xl pl-12 pr-4 py-3 text-primary focus:outline-none focus:ring-2 focus:ring-orange"
            />
          </div>

          {/* Filter */}
          <div className="flex gap-3 ">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-muted bg-opacity-50 backdrop-blur-lg ring-1 ring-primary rounded-xl px-4 py-3 text-primary focus:outline-none focus:ring-2 focus:ring-orange cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
            </select>

            <button className="bg-muted bg-opacity-50 backdrop-blur-lg ring-1 ring-primary rounded-xl px-4 py-3 hover:bg-contrast-gradient transition-colors flex items-center gap-2 cursor-pointer">
              <Download size={20} />
              <span className="hidden md:inline">Export</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-muted bg-opacity-50 backdrop-blur-lg ring-1 ring-primary rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary/90 text-sm">Total Orders</p>
                <p className="text-2xl font-bold">{orders.length}</p>
              </div>
              <Package className="text-orange" size={32} />
            </div>
          </div>
          <div className="bg-muted bg-opacity-50 backdrop-blur-lg ring-1 ring-primary rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary/90 text-sm">Processing</p>
                <p className="text-2xl font-bold">
                  {orders.filter((o) => o.status === "Processing").length}
                </p>
              </div>
              <Clock className="text-alert" size={32} />
            </div>
          </div>
          <div className="bg-muted bg-opacity-50 backdrop-blur-lg ring-1 ring-primary rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary/90 text-sm">Shipped</p>
                <p className="text-2xl font-bold">
                  {orders.filter((o) => o.status === "Shipped").length}
                </p>
              </div>
              <Truck className="text-light-blue" size={32} />
            </div>
          </div>
          <div className="bg-muted bg-opacity-50 backdrop-blur-lg ring-1 ring-primary rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary/90 text-sm">Total Spent</p>
                <p className="text-2xl font-bold">$534.95</p>
              </div>
              <CheckCircle className="text-green-check" size={32} />
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-muted bg-opacity-50 backdrop-blur-lg ring-1 ring-primary rounded-xl overflow-hidden">
          {/* Table Header */}
          <div className="bg-orange px-6 py-4">
            <div className="grid grid-cols-12 gap-4 font-semibold">
              <div className="col-span-1">Order ID</div>
              <div className="col-span-2">Date</div>
              <div className="col-span-4">Product</div>
              <div className="col-span-1 text-center">Quantity</div>
              <div className="col-span-2 text-center">Status</div>
              <div className="col-span-1 text-right">Total</div>
              <div className="col-span-1"></div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-primary/70">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="px-6 py-4 hover:bg-contrast-gradient hover:bg-opacity-30 transition-colors"
                >
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-1 font-semibold text-primary/70">
                      {order.id}
                    </div>
                    <div className="col-span-2 text-primary/85">
                      {order.date}
                    </div>
                    <div className="col-span-4 font-medium">
                      {order.product}
                    </div>
                    <div className="col-span-1 text-center">
                      {order.quantity}
                    </div>
                    <div className="col-span-2 flex justify-center">
                      <span
                        className={`flex items-center gap-2 px-3 py-1 rounded-full text-primary text-sm ring-1 ring-primary ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusIcon(order.status)}
                        {order.status}
                      </span>
                    </div>
                    <div className="col-span-1 text-right font-bold text-primary">
                      {order.total}
                    </div>
                    <div className="col-span-1 flex justify-end">
                      <button className="p-2 text-muted bg-primary hover:bg-primary/80  rounded-lg transition-colors cursor-pointer">
                        <Eye size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-12 text-center">
                <Package className="mx-auto mb-4 text-gray-600" size={48} />
                <p className="text-gray-400 text-lg">No orders found</p>
                <p className="text-gray-500 text-sm mt-2">
                  Try adjusting your search or filters
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Pagination */}
        {filteredOrders.length > 0 && (
          <div className="mt-6 flex items-center justify-between">
            <p className="text-primary/80 text-sm pl-6">
              Showing {filteredOrders.length} of {orders.length} orders
            </p>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-contrast-gradient ring-1 ring-primary rounded-lg hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                Previous
              </button>
              <button className="px-4 py-2 bg-orange rounded-lg hover:bg-orange/80 transition-colors cursor-pointer">
                1
              </button>
              <button className="px-4 py-2 bg-contrast-gradient ring-1 ring-primary rounded-lg hover:bg-muted transition-colors cursor-pointer">
                2
              </button>
              <button className="px-4 py-2 bg-contrast-gradient ring-1 ring-primary rounded-lg hover:bg-muted transition-colors cursor-pointer">
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
