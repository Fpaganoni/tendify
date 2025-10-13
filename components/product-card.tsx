"use client";

import type React from "react";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AddToCartButton } from "./add-to-cart-button";
import { stripHtml } from "../utils/stripHtml";
import { WooCommerceProduct } from "@/lib/woocommerce-types";
import { useFavorites } from "@/contexts/favorites-context";

interface ProductCardProps {
  product: WooCommerceProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  const stripDescription = stripHtml(product.description || "");
  const stripCategory = stripHtml(product.categories?.[0]?.name || "");

  const { isFavorite, toggleFavorite } = useFavorites();

  const isProductFavorite = isFavorite(product.id);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // TODO: Implement favorite functionality

    const productFav = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0]?.src || "/placeholder.svg",
      featured: product.featured,
      description: stripDescription,
      stock: product.stock_quantity, // WooCommerceProduct does not have stock info in this context
    };

    toggleFavorite(productFav);
  };

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={product.images?.[0].src || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {product.featured && (
            <Badge className="absolute top-2 left-2 bg-secondary text-secondary-foreground">
              Featured
            </Badge>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover:bg-background hover:cursor-pointer"
            aria-label={
              isProductFavorite ? "Remove from favorites" : "Add to favorites"
            }
            onClick={handleToggleFavorite}
          >
            {isProductFavorite ? (
              <Heart fill="#f0f0f0" className="h-4 w-4" />
            ) : (
              <Heart className="h-4 w-4" />
            )}
          </Button>
        </div>
      </Link>

      <CardContent className="p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 hover:text-primary transition-colors">
            {product.name}
          </h3>
          <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
            {stripDescription}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-secondary-foreground">
              ${parseFloat(product.price).toFixed(2)}
            </span>
            <Badge variant="outline" className="text-xs">
              {stripCategory}
            </Badge>
          </div>
        </Link>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <AddToCartButton
          product={product}
          className="w-full hover:cursor-pointer"
        />
      </CardFooter>
    </Card>
  );
}
