import { useEffect, useRef } from "react";
import type { Property } from "@/lib/domain";

type YandexMapProps = { center: { lat: number; lng: number }; zoom: number; properties: Property[]; onReady: () => void; onError: () => void };
type YMapInstance = { addChild: (child: unknown) => void; destroy?: () => void };
type YMaps3 = { ready: Promise<void>; YMap: new (node: HTMLElement, config: unknown) => YMapInstance; YMapDefaultSchemeLayer: new (config?: unknown) => unknown; YMapDefaultFeaturesLayer: new (config?: unknown) => unknown; YMapMarker: new (config: unknown, element: HTMLElement) => unknown };

declare global { interface Window { ymaps3?: YMaps3; } }

function loadYandex(apiKey: string) {
  if (window.ymaps3) return Promise.resolve(window.ymaps3);
  return new Promise<YMaps3>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-rentbez-yandex-maps="true"]');
    if (existing) { existing.addEventListener("load", () => window.ymaps3 ? resolve(window.ymaps3) : reject(new Error("Yandex Maps did not initialize")), { once: true }); existing.addEventListener("error", () => reject(new Error("Yandex Maps failed to load")), { once: true }); return; }
    const script = document.createElement("script");
    script.dataset.rentbezYandexMaps = "true";
    script.async = true;
    script.src = `https://api-maps.yandex.ru/v3/?apikey=${encodeURIComponent(apiKey)}&lang=ru_RU`;
    script.onload = () => window.ymaps3 ? resolve(window.ymaps3) : reject(new Error("Yandex Maps did not initialize"));
    script.onerror = () => reject(new Error("Yandex Maps failed to load"));
    document.head.appendChild(script);
  });
}

export function YandexMap({ center, zoom, properties, onReady, onError }: YandexMapProps) {
  const nodeRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const apiKey = import.meta.env.VITE_YANDEX_MAPS_API_KEY as string | undefined;
    if (!apiKey || !nodeRef.current) { onError(); return; }
    let map: YMapInstance | undefined;
    let disposed = false;
    loadYandex(apiKey).then(async (ymaps3) => {
      await ymaps3.ready;
      if (disposed || !nodeRef.current) return;
      map = new ymaps3.YMap(nodeRef.current, { location: { center: [center.lng, center.lat], zoom } });
      map.addChild(new ymaps3.YMapDefaultSchemeLayer());
      map.addChild(new ymaps3.YMapDefaultFeaturesLayer());
      properties.forEach((property) => {
        const marker = document.createElement("button");
        marker.type = "button"; marker.className = "yandex-price-marker"; marker.textContent = `${Math.round(property.price / 1000)}K`;
        marker.setAttribute("aria-label", `${property.title}: ${property.price.toLocaleString("ru-RU")} ₽`);
        marker.addEventListener("click", () => window.location.assign(`/listing/${property.id}`));
        map?.addChild(new ymaps3.YMapMarker({ coordinates: [property.coordinates.lng, property.coordinates.lat] }, marker));
      });
      onReady();
    }).catch(onError);
    return () => { disposed = true; map?.destroy?.(); };
  }, [center.lat, center.lng, onError, onReady, properties, zoom]);
  return <div ref={nodeRef} className="property-map__canvas yandex-map-canvas" aria-label="Интерактивная Яндекс Карта" />;
}
