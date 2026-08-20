export const FAVORITES_STORAGE_KEY = "rentbez:favorites:v1";

export function normalizeFavoriteIds(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return Array.from(new Set(value.filter((item): item is string => typeof item === "string" && item.length > 0)));
}

export function toggleFavoriteId(ids: string[], id: string): string[] {
  return ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id];
}
