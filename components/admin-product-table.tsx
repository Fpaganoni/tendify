"use client";

import { useState } from "react";
import Image from "next/image";
import { MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ProductMock } from "@/lib/mock-types";

interface AdminProductTableProps {
  products: ProductMock[];
}

export function AdminProductTable({ products }: AdminProductTableProps) {
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);

  const handleEdit = (productId: number) => {
    console.log("Edit product:", productId);
  };

  const handleDelete = (productId: number) => {
    console.log("Delete product:", productId);
  };

  const handleView = (productId: number) => {
    console.log("View product:", productId);
  };

  return (
    <Card className="w-full ">
      <CardHeader>
        <CardTitle>Products</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[70px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <div className="relative h-10 w-10 rounded-md overflow-hidden">
                      <Image
                        src={product.images[0].src || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium line-clamp-1">{product.name}</p>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {product.description}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{product.categories[0].name}</Badge>
                </TableCell>
                <TableCell className="font-medium">
                  ${parseFloat(product.prices.price).toFixed(2)}
                </TableCell>
                <TableCell>
                  <span
                    className={
                      product.stock_availability.text === "In Stock"
                        ? "text-green-500"
                        : "text-red-500"
                    }
                  >
                    {product.stock_availability.text === "In Stock"
                      ? "In Stock"
                      : "Out of Stock"}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant={product.featured ? "default" : "secondary"}>
                    {product.featured ? "Featured" : "Regular"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleView(product.id)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(product.id)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(product.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
