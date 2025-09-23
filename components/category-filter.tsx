"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface CategoryFilterProps {
  categories: string[]
  onFilterChange: (filters: FilterState) => void
}

export interface FilterState {
  category: string
  priceRange: [number, number]
  sortBy: string
}

export function CategoryFilter({ categories, onFilterChange }: CategoryFilterProps) {
  const [filters, setFilters] = useState<FilterState>({
    category: "all",
    priceRange: [0, 500],
    sortBy: "name",
  })

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    const updatedFilters = { ...filters, ...newFilters }
    setFilters(updatedFilters)
    onFilterChange(updatedFilters)
  }

  const clearFilters = () => {
    const defaultFilters: FilterState = {
      category: "all",
      priceRange: [0, 500],
      sortBy: "name",
    }
    setFilters(defaultFilters)
    onFilterChange(defaultFilters)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Filters
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear All
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Category Filter */}
        <div className="space-y-3">
          <h4 className="font-medium">Category</h4>
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={filters.category === "all" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handleFilterChange({ category: "all" })}
            >
              All
            </Badge>
            {categories.map((category) => (
              <Badge
                key={category}
                variant={filters.category === category ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => handleFilterChange({ category })}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        {/* Price Range Filter */}
        <div className="space-y-3">
          <h4 className="font-medium">Price Range</h4>
          <div className="px-2">
            <Slider
              value={filters.priceRange}
              onValueChange={(value) => handleFilterChange({ priceRange: value as [number, number] })}
              max={500}
              min={0}
              step={10}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground mt-2">
              <span>${filters.priceRange[0]}</span>
              <span>${filters.priceRange[1]}</span>
            </div>
          </div>
        </div>

        {/* Sort By */}
        <div className="space-y-3">
          <h4 className="font-medium">Sort By</h4>
          <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange({ sortBy: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name (A-Z)</SelectItem>
              <SelectItem value="name-desc">Name (Z-A)</SelectItem>
              <SelectItem value="price">Price (Low to High)</SelectItem>
              <SelectItem value="price-desc">Price (High to Low)</SelectItem>
              <SelectItem value="featured">Featured First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}
