"use client";

import { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-context";
import type { Product } from "@/lib/types";
import { WooCommerceProduct } from "@/lib/woocommerce-types";

interface AddToCartButtonProps {
  product: WooCommerceProduct;
  className?: string;
  size?: "default" | "sm" | "lg";
  variant?: "default" | "outline" | "ghost";
}

export function AddToCartButton({
  product,
  className,
  size = "default",
  variant = "default",
}: AddToCartButtonProps) {
  const { dispatch } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    dispatch({ type: "ADD_ITEM", product });
    setIsAdded(true);

    // Reset the success state after 2 seconds
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  if (product.stock_quantity === 0) {
    return (
      <Button disabled size={size} variant={variant} className={className}>
        Out of Stock
      </Button>
    );
  }

  return (
    <Button
      onClick={handleAddToCart}
      size={size}
      variant={variant}
      className={className}
      disabled={isAdded}
    >
      {isAdded ? (
        <>
          <Check className="h-4 w-4 mr-2" />
          Added!
        </>
      ) : (
        <>
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </>
      )}
    </Button>
  );
}
