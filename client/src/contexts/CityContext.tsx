import { createContext, useContext, useMemo, useState } from "react";

export type CityId = "kazan" | "saint-petersburg";

export const cities: Record<CityId, { name: string; prepositional: string; center: google.maps.LatLngLiteral; zoom: number }> = {
  kazan: { name: "Казань", prepositional: "Казани", center: { lat: 55.7961, lng: 49.1064 }, zoom: 11 },
  "saint-petersburg": { name: "Санкт-Петербург", prepositional: "Санкт-Петербурге", center: { lat: 59.9343, lng: 30.3351 }, zoom: 11 },
};

type CityContextValue = { city: CityId; setCity: (city: CityId) => void; cityInfo: (typeof cities)[CityId] };
const CityContext = createContext<CityContextValue | null>(null);

function initialCity(): CityId {
  if (typeof window === "undefined") return "kazan";
  const fromUrl = new URLSearchParams(window.location.search).get("city");
  if (fromUrl === "kazan" || fromUrl === "saint-petersburg") return fromUrl;
  return localStorage.getItem("rentbez-city") === "saint-petersburg" ? "saint-petersburg" : "kazan";
}

export function CityProvider({ children }: { children: React.ReactNode }) {
  const [city, updateCity] = useState<CityId>(initialCity);
  const value = useMemo<CityContextValue>(() => ({
    city,
    cityInfo: cities[city],
    setCity: (next) => {
      updateCity(next);
      localStorage.setItem("rentbez-city", next);
      const url = new URL(window.location.href);
      url.searchParams.set("city", next);
      window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
    },
  }), [city]);
  return <CityContext.Provider value={value}>{children}</CityContext.Provider>;
}

export function useCity() {
  const context = useContext(CityContext);
  if (!context) throw new Error("useCity must be used inside CityProvider");
  return context;
}
