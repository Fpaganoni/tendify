"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CheckoutProgress } from "@/components/checkout-progress"
import { CheckoutForm } from "@/components/checkout-form"
import { ScrollAnimation } from "@/components/scroll-animations"
import { useCart } from "@/lib/cart-context"

export default function CheckoutPage() {
  const { state } = useCart()
  const router = useRouter()

  useEffect(() => {
    if (state.items.length === 0) {
      router.push("/products")
    }
  }, [state.items.length, router])

  if (state.items.length === 0) {
    return null
  }

  return (
    <div className="min-h-screen">
      <Header />
      <div className="container px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <ScrollAnimation animation="fadeInUp">
            <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>
          </ScrollAnimation>
          <ScrollAnimation animation="fadeInUp" delay={200}>
            <CheckoutProgress currentStep={2} />
          </ScrollAnimation>
          <ScrollAnimation animation="fadeInUp" delay={400}>
            <CheckoutForm />
          </ScrollAnimation>
        </div>
      </div>
      <Footer />
    </div>
  )
}
