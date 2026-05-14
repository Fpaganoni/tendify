"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { AdminLayout } from "@/components/admin-layout";
import { AdminProductTable } from "@/components/admin-product-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import type { WooCommerceProduct } from "@/lib/woocommerce-types";

export default function AdminProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<number | "all">("all");
  const [products, setProducts] = useState<WooCommerceProduct[]>([]);
  // We'll extract categories from the fetched products for simplicity,
  // or you could add an /api/categories route in the future.
  const [categories, setCategories] = useState<{id: number, name: string}[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch products via our Next.js API route to avoid CORS and hide WC credentials
  useEffect(() => {
    setIsLoading(true);
    
    // Construct query parameters
    const params = new URLSearchParams();
    params.append("per_page", "50");
    if (searchQuery) params.append("search", searchQuery);
    if (categoryFilter !== "all") params.append("category", categoryFilter.toString());

    fetch(`/api/products?${params.toString()}`)
      .then((res) => res.json())
      .then((data: WooCommerceProduct[]) => {
        setProducts(data);
        
        // Extract unique categories from the loaded products
        const uniqueCategories = new Map<number, {id: number, name: string}>();
        data.forEach(p => {
          p.categories?.forEach(c => {
            if (!uniqueCategories.has(c.id)) {
              uniqueCategories.set(c.id, c);
            }
          });
        });
        setCategories(Array.from(uniqueCategories.values()));
      })
      .catch((err) => console.error("Failed to load products", err))
      .finally(() => setIsLoading(false));
  }, [searchQuery, categoryFilter]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Products</h1>
            <p className="text-muted-foreground">
              Manage your product inventory
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>

        <div className="flex items-center space-x-4">
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
          <Select 
            value={categoryFilter.toString()} 
            onValueChange={(val) => setCategoryFilter(val === "all" ? "all" : parseInt(val))}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <Skeleton className="h-[400px] w-full" />
        ) : (
          <AdminProductTable products={products} />
        )}
      </div>
    </AdminLayout>
  );
}
