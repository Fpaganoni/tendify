import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ScrollAnimation } from "@/components/scroll-animations"

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-r from-background to-card py-20 lg:py-32">
      <div className="container px-4 mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          <ScrollAnimation animation="fadeInUp">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance text-foreground">
              Discover Premium Products for Your Lifestyle
            </h1>
          </ScrollAnimation>
          <ScrollAnimation animation="fadeInUp" delay={200}>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 text-pretty">
              Shop our curated collection of high-quality products designed to enhance your everyday life.
            </p>
          </ScrollAnimation>
          <ScrollAnimation animation="fadeInUp" delay={400}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-6" asChild>
                <Link href="/products">Shop Now</Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-transparent" asChild>
                <Link href="/categories">Browse Categories</Link>
              </Button>
            </div>
          </ScrollAnimation>
        </div>
      </div>
    </section>
  )
}
