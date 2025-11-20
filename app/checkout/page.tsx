"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CheckoutProgress } from "@/components/checkout-progress";
import { CheckoutForm } from "@/components/checkout-form";
import { ScrollAnimation } from "@/components/scroll-animations";
import { useCart } from "@/lib/cart-context";

export default function CheckoutPage() {
  const { state } = useCart();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Only redirect to products if cart is empty and we're not processing a checkout
    if (state.items.length === 0 && !isProcessing) {
      router.push("/products");
    }
  }, [state.items.length, router, isProcessing]);

  if (state.items.length === 0 && !isProcessing) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container px-4 py-8">
        <div className="max-w-6xl mx-auto pb-32">
          <ScrollAnimation animation="fadeInUp">
            <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>
          </ScrollAnimation>
          <ScrollAnimation animation="fadeInUp" delay={200}>
            <CheckoutProgress currentStep={2} />
          </ScrollAnimation>
          <ScrollAnimation animation="fadeInUp" delay={400}>
            <CheckoutForm onProcessingChange={setIsProcessing} />
          </ScrollAnimation>
        </div>
      </main>
      <Footer />
    </div>
  );
}
