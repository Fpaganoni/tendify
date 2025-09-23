"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductGrid } from "@/components/product-grid"
import { CategoryFilter, type FilterState } from "@/components/category-filter"
import { ScrollAnimation } from "@/components/scroll-animations"
import { getProducts } from "@/lib/db"
import type { Product } from "@/lib/types"

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get("search") || ""

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts()
        setProducts(data)
        setFilteredProducts(data)
      } catch (error) {
        console.error("Failed to load products:", error)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  useEffect(() => {
    if (searchQuery && products.length > 0) {
      const searchFiltered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredProducts(searchFiltered)
    } else if (products.length > 0) {
      setFilteredProducts(products)
    }
  }, [searchQuery, products])

  const handleFilterChange = (filters: FilterState) => {
    let filtered = searchQuery
      ? products.filter(
          (product) =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.category.toLowerCase().includes(searchQuery.toLowerCase()),
        )
      : [...products]

    // Filter by category
    if (filters.category !== "all") {
      filtered = filtered.filter((product) => product.category === filters.category)
    }

    // Filter by price range
    filtered = filtered.filter(
      (product) => product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1],
    )

    // Sort products
    switch (filters.sortBy) {
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "name-desc":
        filtered.sort((a, b) => b.name.localeCompare(a.name))
        break
      case "price":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "featured":
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
        break
    }

    setFilteredProducts(filtered)
  }

  const categories = Array.from(new Set(products.map((product) => product.category)))

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container px-4 py-16">
          <div className="text-center">Loading products...</div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />
      <div className="container px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-80 flex-shrink-0">
            <ScrollAnimation animation="fadeInLeft">
              <CategoryFilter categories={categories} onFilterChange={handleFilterChange} />
            </ScrollAnimation>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <ScrollAnimation animation="fadeInUp">
              <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">
                  {searchQuery ? `Search Results for "${searchQuery}"` : "All Products"}
                </h1>
                <p className="text-muted-foreground">
                  Showing {filteredProducts.length} of {products.length} products
                  {searchQuery && filteredProducts.length === 0 && (
                    <span className="block mt-2 text-destructive">
                      No products found matching your search. Try different keywords.
                    </span>
                  )}
                </p>
              </div>
            </ScrollAnimation>
            <ScrollAnimation animation="fadeInUp" delay={200}>
              <ProductGrid products={filteredProducts} />
            </ScrollAnimation>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  )
}
