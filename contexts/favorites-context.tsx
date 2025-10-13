"use client";

import type React from "react";
import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  type ReactNode,
} from "react";
import { useAuth } from "@/lib/auth-context";

export interface FavoriteProduct {
  id: number;
  name: string;
  price: string;
  image: string;
  featured: boolean;
  description: string;
  stock: number | null;
}

interface FavoritesState {
  favorites: FavoriteProduct[];
  isLoading: boolean;
}

type FavoritesAction =
  | { type: "SET_LOADING"; loading: boolean }
  | { type: "SET_FAVORITES"; favorites: FavoriteProduct[] }
  | { type: "ADD_FAVORITE"; product: FavoriteProduct }
  | { type: "REMOVE_FAVORITE"; productId: number }
  | { type: "CLEAR_FAVORITES" };

const FavoritesContext = createContext<{
  state: FavoritesState;
  dispatch: React.Dispatch<FavoritesAction>;
  toggleFavorite: (product: FavoriteProduct) => void;
  isFavorite: (productId: number) => boolean;
  clearFavorites: () => void;
  favoritesCount: number;
} | null>(null);

function favoritesReducer(
  state: FavoritesState,
  action: FavoritesAction
): FavoritesState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.loading };
    case "SET_FAVORITES":
      return { ...state, favorites: action.favorites, isLoading: false };
    case "ADD_FAVORITE":
      return {
        ...state,
        favorites: [...state.favorites, action.product],
        isLoading: false,
      };
    case "REMOVE_FAVORITE":
      return {
        ...state,
        favorites: state.favorites.filter((fav) => fav.id !== action.productId),
        isLoading: false,
      };
    case "CLEAR_FAVORITES":
      return {
        ...state,
        favorites: [],
        isLoading: false,
      };
    default:
      return state;
  }
}

// Helper functions para manejar localStorage
const GUEST_FAVORITES_KEY = "guest_favorites";

const getGuestFavorites = (): FavoriteProduct[] => {
  try {
    const stored = localStorage.getItem(GUEST_FAVORITES_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    }
  } catch (error) {
    console.error("Error loading guest favorites:", error);
  }
  return [];
};

const saveGuestFavorites = (favorites: FavoriteProduct[]): void => {
  try {
    localStorage.setItem(GUEST_FAVORITES_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.error("Error saving guest favorites:", error);
  }
};

const clearGuestFavorites = (): void => {
  try {
    localStorage.removeItem(GUEST_FAVORITES_KEY);
  } catch (error) {
    console.error("Error clearing guest favorites:", error);
  }
};

// Generar key única por usuario
const getUserFavoritesKey = (userId: number): string => {
  return `user_${userId}_favorites`;
};

const getUserFavorites = (userId: number): FavoriteProduct[] => {
  try {
    const key = getUserFavoritesKey(userId);
    const stored = localStorage.getItem(key);
    if (stored) {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    }
  } catch (error) {
    console.error("Error loading user favorites:", error);
  }
  return [];
};

const saveUserFavorites = (
  userId: number,
  favorites: FavoriteProduct[]
): void => {
  try {
    const key = getUserFavoritesKey(userId);
    localStorage.setItem(key, JSON.stringify(favorites));
  } catch (error) {
    console.error("Error saving user favorites:", error);
  }
};

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { state: authState } = useAuth();
  const [state, dispatch] = useReducer(favoritesReducer, {
    favorites: [],
    isLoading: true,
  });

  // Cargar favoritos al montar y cuando cambie el usuario
  useEffect(() => {
    dispatch({ type: "SET_LOADING", loading: true });

    if (authState.isAuthenticated && authState.user) {
      // Usuario autenticado: cargar sus favoritos
      const userFavorites = getUserFavorites(authState.user.id);

      // Verificar si hay favoritos de invitado para migrar
      const guestFavorites = getGuestFavorites();

      if (guestFavorites.length > 0) {
        // Migrar favoritos: combinar sin duplicados
        const combinedFavorites = [...userFavorites];

        guestFavorites.forEach((guestFav) => {
          const exists = combinedFavorites.some(
            (fav) => fav.id === guestFav.id
          );
          if (!exists) {
            combinedFavorites.push(guestFav);
          }
        });

        // Guardar favoritos combinados para el usuario
        saveUserFavorites(authState.user.id, combinedFavorites);

        // Limpiar favoritos de invitado
        clearGuestFavorites();

        dispatch({ type: "SET_FAVORITES", favorites: combinedFavorites });

        console.log(
          `✅ Migrated ${guestFavorites.length} guest favorites to user ${authState.user.id}`
        );
      } else {
        dispatch({ type: "SET_FAVORITES", favorites: userFavorites });
      }
    } else {
      // Usuario invitado: cargar favoritos de invitado
      const guestFavorites = getGuestFavorites();
      dispatch({ type: "SET_FAVORITES", favorites: guestFavorites });
    }
  }, [authState.isAuthenticated, authState.user]);

  // Guardar favoritos cuando cambien
  useEffect(() => {
    if (!state.isLoading) {
      if (authState.isAuthenticated && authState.user) {
        // Guardar en favoritos del usuario
        saveUserFavorites(authState.user.id, state.favorites);
      } else {
        // Guardar en favoritos de invitado
        saveGuestFavorites(state.favorites);
      }
    }
  }, [
    state.favorites,
    authState.isAuthenticated,
    authState.user,
    state.isLoading,
  ]);

  const isFavorite = (productId: number): boolean => {
    return state.favorites.some((fav) => fav.id === productId);
  };

  const toggleFavorite = (product: FavoriteProduct): void => {
    if (isFavorite(product.id)) {
      dispatch({ type: "REMOVE_FAVORITE", productId: product.id });
      console.log("❌ Removed from favorites:", product.name);
    } else {
      dispatch({ type: "ADD_FAVORITE", product });
      console.log("✅ Added to favorites:", product.name);
    }
  };

  const clearFavorites = (): void => {
    dispatch({ type: "CLEAR_FAVORITES" });

    if (authState.isAuthenticated && authState.user) {
      saveUserFavorites(authState.user.id, []);
    } else {
      clearGuestFavorites();
    }
  };

  const favoritesCount = state.favorites.length;

  return (
    <FavoritesContext.Provider
      value={{
        state,
        dispatch,
        toggleFavorite,
        isFavorite,
        clearFavorites,
        favoritesCount,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}
