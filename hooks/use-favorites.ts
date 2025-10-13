// // ============================================
// // PASO 1 y 2: Custom Hook para manejar favoritos
// // ============================================
// import { useState, useEffect } from "react";

// interface FavoriteProduct {
//   id: number;
//   name: string;
//   price: string;
//   image: string;
//   featured: boolean;
//   description: string;
//   stock: number | null;
// }

// const FAVORITES_KEY = "favorites";

// export function useFavorites() {
//   const [favorites, setFavorites] = useState<FavoriteProduct[]>([]);

//   // PASO 6: Inicializar - Leer favoritos al montar
//   useEffect(() => {
//     try {
//       const stored = localStorage.getItem(FAVORITES_KEY);
//       if (stored) {
//         const parsed = JSON.parse(stored);
//         setFavorites(Array.isArray(parsed) ? parsed : []);
//       }
//     } catch (error) {
//       console.error("Error loading favorites:", error);
//       setFavorites([]);
//     }
//   }, []);

//   // PASO 2: Verificar si un producto está en favoritos
//   const isFavorite = (productId: number): boolean => {
//     return favorites.some((fav) => fav.id === productId);
//   };

//   // PASO 3 y 4: Toggle favorito (agregar o quitar)
//   const toggleFavorite = (product: FavoriteProduct): boolean => {
//     try {
//       let updatedFavorites: FavoriteProduct[];

//       if (isFavorite(product.id)) {
//         // Ya existe - QUITAR
//         updatedFavorites = favorites.filter((fav) => fav.id !== product.id);
//       } else {
//         // No existe - AGREGAR
//         updatedFavorites = [...favorites, product];
//       }

//       // PASO 4: Guardar en localStorage
//       localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
//       setFavorites(updatedFavorites);

//       return !isFavorite(product.id); // Retorna el nuevo estado
//     } catch (error) {
//       // PASO 8: Validación y manejo de errores
//       if (error instanceof Error && error.name === "QuotaExceededError") {
//         console.error("LocalStorage is full");
//         alert("No se puede agregar más favoritos. Espacio lleno.");
//       } else {
//         console.error("Error toggling favorite:", error);
//       }
//       return isFavorite(product.id);
//     }
//   };

//   // Obtener todos los favoritos
//   const getFavorites = (): FavoriteProduct[] => {
//     return favorites;
//   };

//   // Contar favoritos
//   const favoritesCount = favorites.length;

//   return {
//     favorites,
//     isFavorite,
//     toggleFavorite,
//     getFavorites,
//     favoritesCount,
//   };
// }
