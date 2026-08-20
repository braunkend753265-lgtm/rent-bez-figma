import type { PropertyFilters } from "@/lib/domain";

export const DEFAULT_SEARCH_FILTERS: PropertyFilters = {
  query: "",
  rooms: "all",
  minPrice: 0,
  maxPrice: 100000,
  minArea: 0,
  maxArea: 200,
  rentalType: "long",
  availability: "all",
};

function numberParam(params: URLSearchParams, key: string, fallback: number) {
  const raw = params.get(key);
  if (raw === null || raw.trim() === "") return fallback;
  const value = Number(raw);
  return Number.isFinite(value) && value >= 0 ? value : fallback;
}

export function filtersFromSearch(search: string): PropertyFilters {
  const params = new URLSearchParams(search);
  const rooms = params.get("rooms");
  return {
    query: params.get("q") ?? "",
    rooms: rooms === "1" || rooms === "2" || rooms === "3" ? rooms : "all",
    minPrice: numberParam(params, "minPrice", DEFAULT_SEARCH_FILTERS.minPrice ?? 0),
    maxPrice: numberParam(params, "max", DEFAULT_SEARCH_FILTERS.maxPrice),
    minArea: numberParam(params, "minArea", DEFAULT_SEARCH_FILTERS.minArea ?? 0),
    maxArea: numberParam(params, "maxArea", DEFAULT_SEARCH_FILTERS.maxArea ?? 200),
    rentalType: params.get("term") === "daily" ? "daily" : "long",
    availability: "all",
  };
}
