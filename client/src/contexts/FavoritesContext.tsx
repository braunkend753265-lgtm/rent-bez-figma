import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { FAVORITES_STORAGE_KEY, normalizeFavoriteIds, toggleFavoriteId } from "@/lib/favorites";

type FavoritesContextValue = { ids: string[]; isFavorite: (id: string) => boolean; toggleFavorite: (id: string) => void };
const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [ids, setIds] = useState<string[]>(() => {
    try { return normalizeFavoriteIds(JSON.parse(window.localStorage.getItem(FAVORITES_STORAGE_KEY) ?? "[]")); } catch { return []; }
  });
  useEffect(() => { window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(ids)); }, [ids]);
  const toggleFavorite = useCallback((id: string) => setIds((current) => {
    const saved = current.includes(id);
    toast.success(saved ? "Удалено из избранного" : "Добавлено в избранное");
    return toggleFavoriteId(current, id);
  }), []);
  const value = useMemo(() => ({ ids, isFavorite: (id: string) => ids.includes(id), toggleFavorite }), [ids, toggleFavorite]);
  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error("useFavorites must be used inside FavoritesProvider");
  return context;
}
