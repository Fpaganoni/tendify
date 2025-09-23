import { HeroSection } from "@/components/hero-section"
import { ProductGrid } from "@/components/product-grid"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ScrollAnimation } from "@/components/scroll-animations"
import { getFeaturedProducts } from "@/lib/db"

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts()

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <ScrollAnimation animation="fadeInUp" delay={200}>
          <div className="container px-4 py-16">
            <ProductGrid products={featuredProducts} title="Featured Products" />
          </div>
        </ScrollAnimation>
      </main>
      <Footer />
    </div>
  )
}
