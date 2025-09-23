import Link from "next/link"
import { CheckCircle, Package, Truck } from "lucide-react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckoutProgress } from "@/components/checkout-progress"

export default function CheckoutSuccessPage() {
  const orderNumber = `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

  return (
    <div className="min-h-screen">
      <Header />
      <div className="container px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <CheckoutProgress currentStep={4} />

          <div className="text-center py-12">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Thank you for your purchase. Your order has been successfully placed.
            </p>

            <Card className="max-w-md mx-auto mb-8">
              <CardHeader>
                <CardTitle className="text-center">Order Details</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-2">
                <p className="font-medium">Order Number</p>
                <p className="text-2xl font-bold text-primary">{orderNumber}</p>
                <p className="text-sm text-muted-foreground">
                  A confirmation email has been sent to your email address.
                </p>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-8">
              <Card>
                <CardContent className="flex items-center space-x-4 p-6">
                  <Package className="h-8 w-8 text-primary" />
                  <div className="text-left">
                    <h3 className="font-semibold">Processing</h3>
                    <p className="text-sm text-muted-foreground">Your order is being prepared</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-center space-x-4 p-6">
                  <Truck className="h-8 w-8 text-primary" />
                  <div className="text-left">
                    <h3 className="font-semibold">Shipping</h3>
                    <p className="text-sm text-muted-foreground">Estimated delivery: 5-7 business days</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link href="/products">Continue Shopping</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/orders">View Orders</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
