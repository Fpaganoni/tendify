// 3. Página de Favoritos
// ============================================
"use client";

import { useFavorites } from "@/contexts/favorites-context";
import { useAuth } from "@/lib/auth-context";
import { Heart, Trash2 } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function FavoritesPage() {
  const {
    state: favState,
    clearFavorites,
    toggleFavorite,
    favoritesCount,
  } = useFavorites();
  const { state: authState } = useAuth();

  if (favState.isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Loading Favorites...</p>
      </div>
    );
  }

  if (favoritesCount === 0) {
    return (
      <div className="min-h-screen">
        <Header />

        <div className="container h-screen flex flex-col  justify-center mx-auto px-4 py-8 text-center">
          <Heart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold mb-2">
            You don't have favorites yet
          </h2>
          <p className="text-gray-600 mb-6">
            Start adding products you like to see them here.
          </p>
          <Link href="/products" className="btn-primary">
            See Products
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container mx-auto pt-16 pb-32 py-8 xl:px-24">
        <div className="flex justify-between items-center mb-6 ">
          <div>
            <h1 className="text-3xl font-bold">My Favorites</h1>
            <p className="text-gray-600">
              {favoritesCount} {favoritesCount === 1 ? "product" : "products"}
              {authState.isAuthenticated && authState.user && (
                <span className="ml-2 text-sm">
                  ({authState.user.first_name})
                </span>
              )}
            </p>
          </div>

          {favoritesCount > 0 && (
            <button
              onClick={clearFavorites}
              className="btn-secondary flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Clean All
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ">
          {favState.favorites.map((product) => (
            <div
              key={product.id}
              className="border rounded-lg p-4 relative hover:shadow-md transition-shadow duration-200 shadow-muted [#1f2937]"
            >
              <button
                onClick={() => toggleFavorite(product)}
                className="absolute top-2 right-2 p-2 rounded-full bg-white shadow-md hover:bg-gray-100"
                aria-label="Quitar de favoritos"
              >
                <Heart className="w-5 h-5 fill-red-500 text-red-500" />
              </button>

              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover rounded-md mb-4"
              />

              <h3 className="font-semibold text-lg mb-2">{product.name}</h3>

              <p className="text-2xl font-bold text-primary mb-2">
                ${product.price}
              </p>

              {product.stock !== null && (
                <p className="text-sm text-gray-600 mb-4">
                  Stock: {product.stock > 0 ? product.stock : "Sin stock"}
                </p>
              )}

              <Link
                href={`/products/${product.id}`}
                className="btn-primary w-full text-center hover:font-bold transition-all duration-200"
              >
                See Product
              </Link>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
