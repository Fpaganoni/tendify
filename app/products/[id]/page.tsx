"use client";

import { Header } from "@/components/header";
import Image from "next/image";
import { Heart, Star, Truck, Shield, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { notFound } from "next/navigation";

import { getProductById } from "@/lib/db";
import { stripHtml } from "@/utils/stripHtml";
import { useFavorites } from "@/contexts/favorites-context";
import { useEffect, useState } from "react";
import { WooCommerceProduct } from "@/lib/woocommerce-types";
import { Loader } from "@/components/ui/loader";

export interface ProductPageProps {
  params: {
    id: string;
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  const [product, setProduct] = useState<WooCommerceProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        console.log("Loading product with ID:", params.id);

        const response = await fetch(`/api/products/${params.id}`);
        console.log("Fetched all products:", response);

        if (!response.ok) {
          throw new Error("Products not found");
        }

        const fetchProducts = await response.json();
        console.log("Fetched product data:", fetchProducts);

        if (!fetchProducts) {
          console.log("Product not found, redirecting to 404");
          notFound();
        }

        setProduct(fetchProducts);
      } catch (error) {
        console.error("Error loading product:", error);
        setError("Error loading product");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [params.id]);

  if (loading) {
    return <Loader content="Loading Product Details..." />;
  }

  if (error || !product) {
    notFound();
  }

  const idProductFavorite = isFavorite(product.id);
  const stripDescription = stripHtml(product.description);

  const handleToggleFavorites = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

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
    <div className="min-h-screen">
      <Header />
      <div className="container px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-lg bg-card">
              <Image
                src={product.images[0].src || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              {product.featured && (
                <Badge className="absolute top-4 left-4 bg-secondary text-secondary-foreground">
                  Featured
                </Badge>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <Badge variant="outline" className="mb-2">
                {product.categories[0]?.name || "Uncategorized"}
              </Badge>
              <h1 className="text-3xl font-bold mb-4 text-balance">
                {product.name}
              </h1>
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  (4.8) • 124 reviews
                </span>
              </div>
              <p className="text-4xl font-bold text-primary mb-6">
                ${product.price}
              </p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground leading-relaxed">
                {stripDescription}
              </p>
            </div>
            <Separator />
            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              <div
                className={`h-2 w-2 rounded-full ${
                  product.stock_quantity > 0 ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <span className="text-sm">
                {product.stock_quantity > 0
                  ? `${product.stock_quantity} in stock`
                  : "Out of stock"}
              </span>
            </div>
            {/* Action Buttons */}
            <div className="space-y-4">
              <AddToCartButton
                product={product}
                size="lg"
                className="w-full text-lg py-6 cursor-pointer"
              />

              {idProductFavorite ? (
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full bg-transparent cursor-pointer"
                  onClick={handleToggleFavorites}
                >
                  <Heart
                    className="h-5 w-5 mr-2"
                    fill="#EF4444"
                    stroke="#EF4444"
                  />
                  Added to Favorites
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full bg-transparent cursor-pointer"
                  onClick={handleToggleFavorites}
                >
                  <Heart className="h-5 w-5 mr-2" />
                  Add to Favorites
                </Button>
              )}
            </div>
            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card>
                <CardContent className="flex items-center space-x-3 p-4">
                  <Truck className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium text-sm">Free Shipping</p>
                    <p className="text-xs text-muted-foreground">
                      On orders over $50
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-center space-x-3 p-4">
                  <Shield className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium text-sm">Warranty</p>
                    <p className="text-xs text-muted-foreground">
                      1 year coverage
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-center space-x-3 p-4">
                  <RotateCcw className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium text-sm">Returns</p>
                    <p className="text-xs text-muted-foreground">
                      30-day policy
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
