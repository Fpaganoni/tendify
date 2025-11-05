"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { CartDrawer } from "./cart-drawer";
import { AuthDialog } from "./auth-dialog";
import { UserMenu } from "./user-menu";
import { ThemeToggle } from "./theme-toggle";
import { useAuth } from "@/lib/auth-context";
import { useFavorites } from "@/contexts/favorites-context";
import { Heart } from "lucide-react";

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { state } = useAuth();
  const { favoritesCount } = useFavorites();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to products page with search query
      window.location.href = `/products?search=${encodeURIComponent(
        searchQuery.trim()
      )}`;
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-orange flex items-center justify-center">
            <span className="text-primary-foreground font-extrabold text-lg">
              T
            </span>
          </div>
          <span className="font-bold text-xl">Trendify</span>
        </Link>
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            href="/products"
            className="text-sm font-medium hover:text-primary bg-[linear-gradient(currentColor,currentColor)] bg-no-repeat bg-bottom
            [background-size:0%_2px]
            transition-all duration-300 ease-[cubic-bezier(.2,.9,.2,1)]
            hover:[background-size:80%_2px]
            focus:[background-size:80%_2px]
            motion-reduce:transition-none hover:pb-1"
          >
            Products
          </Link>
          <Link
            href="/categories"
            className="text-sm font-medium hover:text-primary bg-[linear-gradient(currentColor,currentColor)] bg-no-repeat bg-bottom
            [background-size:0%_2px]
            transition-all duration-300 ease-[cubic-bezier(.2,.9,.2,1)]
            hover:[background-size:80%_2px]
            focus:[background-size:80%_2px]
            motion-reduce:transition-none hover:pb-1"
          >
            Categories
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium hover:text-primary bg-[linear-gradient(currentColor,currentColor)] bg-no-repeat bg-bottom
            [background-size:0%_2px]
            transition-all duration-300 ease-[cubic-bezier(.2,.9,.2,1)]
            hover:[background-size:80%_2px]
            focus:[background-size:80%_2px]
            motion-reduce:transition-none hover:pb-1"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="text-sm font-medium hover:text-primary bg-[linear-gradient(currentColor,currentColor)] bg-no-repeat bg-bottom
            [background-size:0%_2px]
            transition-all duration-300 ease-[cubic-bezier(.2,.9,.2,1)]
            hover:[background-size:80%_2px]
            focus:[background-size:80%_2px]
            motion-reduce:transition-none hover:pb-1"
          >
            Contact
          </Link>
          {state.user?.role === "admin" && (
            <Link
              href="/admin"
              className="text-sm font-medium hover:text-primary bg-[linear-gradient(currentColor,currentColor)] bg-no-repeat bg-bottom
            [background-size:0%_2px]
            transition-all duration-300 ease-[cubic-bezier(.2,.9,.2,1)]
            hover:[background-size:80%_2px]
            focus:[background-size:80%_2px]
            motion-reduce:transition-none hover:pb-1"
            >
              Admin
            </Link>
          )}

          <Link href="/favorites" className="relative p-2">
            <Heart className="w-6 h-6  " fill="white" />
            {favoritesCount >= 0 && (
              <span className="absolute -top-[0.3rem] -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {favoritesCount}
              </span>
            )}
          </Link>
        </nav>

        {/* Search and Cart */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="hidden sm:flex items-center space-x-2">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-foreground/60" />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-8 w-[200px] lg:w-[300px] bg-background border-input text-foreground placeholder:text-foreground/60"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>

          {/* Mobile Search Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="sm:hidden me-0 md:me-4"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <Search className="h-5 w-5" />
          </Button>

          <ThemeToggle />

          <CartDrawer />

          {/* Auth */}
          {state.isAuthenticated ? <UserMenu /> : <AuthDialog />}

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col space-y-4 mt-6 pl-6 pt-4">
                <Link
                  href="/products"
                  className="text-lg font-medium hover:text-primary transition-colors"
                >
                  Products
                </Link>

                <Link
                  href="/categories"
                  className="text-lg font-medium hover:text-primary transition-colors"
                >
                  Categories
                </Link>

                <Link
                  href="/about"
                  className="text-lg font-medium hover:text-primary transition-colors"
                >
                  About
                </Link>

                <Link
                  href="/contact"
                  className="text-lg font-medium hover:text-primary transition-colors"
                >
                  Contact
                </Link>
                {state.user?.role === "admin" && (
                  <Link
                    href="/admin"
                    className="text-lg font-medium hover:text-primary transition-colors"
                  >
                    Admin
                  </Link>
                )}
                <Link href="/favorites" className="relative p-2">
                  <Heart className="w-6 h-6  " fill="white" />
                  {favoritesCount >= 0 && (
                    <span className="absolute -top-[0.3rem] left-7 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      {favoritesCount}
                    </span>
                  )}
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {isSearchOpen && (
        <div className="border-t px-4 py-3 sm:hidden">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-foreground/60" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-8 w-full bg-background border-input text-foreground placeholder:text-foreground/60"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>
      )}
    </header>
  );
}
