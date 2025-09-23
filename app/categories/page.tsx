import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ScrollAnimation } from "@/components/scroll-animations"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

const categories = [
  {
    id: 1,
    name: "Electronics",
    description: "Latest gadgets and tech accessories",
    image: "/smart-fitness-watch.png",
    productCount: 24,
    featured: true,
  },
  {
    id: 2,
    name: "Fashion",
    description: "Trendy clothing and accessories",
    image: "/organic-cotton-t-shirt.jpg",
    productCount: 18,
    featured: true,
  },
  {
    id: 3,
    name: "Home & Living",
    description: "Furniture and home decor",
    image: "/minimalist-desk-lamp.png",
    productCount: 15,
    featured: false,
  },
  {
    id: 4,
    name: "Food & Beverages",
    description: "Gourmet food and premium drinks",
    image: "/artisan-coffee-beans.jpg",
    productCount: 12,
    featured: false,
  },
  {
    id: 5,
    name: "Sports & Fitness",
    description: "Equipment for active lifestyle",
    image: "/smart-fitness-watch.png",
    productCount: 20,
    featured: true,
  },
  {
    id: 6,
    name: "Books & Media",
    description: "Books, music, and entertainment",
    image: "/books-and-media.png",
    productCount: 8,
    featured: false,
  },
]

export default function CategoriesPage() {
  const featuredCategories = categories.filter((cat) => cat.featured)
  const allCategories = categories

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <ScrollAnimation>
          <section className="bg-gradient-to-r from-primary/10 to-secondary/10 py-16">
            <div className="container px-4">
              <div className="text-center max-w-3xl mx-auto">
                <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">Shop by Category</h1>
                <p className="text-lg text-muted-foreground mb-8">
                  Discover our carefully curated collection across different categories. Find exactly what you're
                  looking for with our organized shopping experience.
                </p>
              </div>
            </div>
          </section>
        </ScrollAnimation>

        {/* Featured Categories */}
        <ScrollAnimation>
          <section className="py-16">
            <div className="container px-4">
              <h2 className="text-3xl font-bold text-center mb-12">Featured Categories</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredCategories.map((category, index) => (
                  <ScrollAnimation key={category.id} delay={index * 0.1}>
                    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={category.image || "/placeholder.svg"}
                          alt={category.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                        <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">Featured</Badge>
                      </div>
                      <CardHeader>
                        <CardTitle className="text-xl">{category.name}</CardTitle>
                        <CardDescription>{category.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">{category.productCount} products</span>
                          <Button asChild>
                            <Link href={`/products?category=${category.name.toLowerCase()}`}>Shop Now</Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </ScrollAnimation>
                ))}
              </div>
            </div>
          </section>
        </ScrollAnimation>

        {/* All Categories */}
        <ScrollAnimation>
          <section className="py-16 bg-muted/30">
            <div className="container px-4">
              <h2 className="text-3xl font-bold text-center mb-12">All Categories</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {allCategories.map((category, index) => (
                  <ScrollAnimation key={category.id} delay={index * 0.05}>
                    <Card className="hover:shadow-md transition-shadow duration-200">
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                            <Image
                              src={category.image || "/placeholder.svg"}
                              alt={category.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{category.name}</h3>
                            <p className="text-sm text-muted-foreground">{category.productCount} products</p>
                          </div>
                        </div>
                        <Button asChild className="w-full mt-4 bg-transparent" variant="outline">
                          <Link href={`/products?category=${category.name.toLowerCase()}`}>Browse</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </ScrollAnimation>
                ))}
              </div>
            </div>
          </section>
        </ScrollAnimation>
      </main>
      <Footer />
    </div>
  )
}
