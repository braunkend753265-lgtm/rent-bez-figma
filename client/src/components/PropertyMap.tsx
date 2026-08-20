import { useCallback, useEffect, useRef, useState } from "react";
import { MapPin, Minus, Plus } from "lucide-react";
import { cities, type CityId } from "@/contexts/CityContext";
import { MapView } from "@/components/Map";
import { formatRubles, type Property } from "@/lib/domain";

export function PropertyMap({ properties, city }: { properties: Property[]; city: CityId }) {
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const [state, setState] = useState<"loading" | "ready" | "fallback">("loading");
  const [fallbackZoom, setFallbackZoom] = useState(1);
  const cityInfo = cities[city];
  const renderMarkers = useCallback((map: google.maps.Map) => {
    markersRef.current.forEach((marker) => marker.map = null);
    markersRef.current = properties.map((property) => {
      const marker = document.createElement("button");
      marker.type = "button"; marker.className = "google-price-marker"; marker.textContent = `${Math.round(property.price / 1000)}K`;
      marker.setAttribute("aria-label", `${property.title}: ${formatRubles(property.price)}`);
      marker.addEventListener("click", () => { window.location.assign(`/listing/${property.id}`); });
      return new google.maps.marker.AdvancedMarkerElement({ map, position: property.coordinates, content: marker, title: property.title });
    });
  }, [properties]);
  useEffect(() => { setState("loading"); if (!mapRef.current) return; mapRef.current.setCenter(cityInfo.center); mapRef.current.setZoom(cityInfo.zoom); renderMarkers(mapRef.current); setState("ready"); }, [city, cityInfo, renderMarkers]);
  return <section className="property-map property-map--google" aria-label={`Карта объектов: ${cityInfo.name}`}><div className="property-map__label">{cityInfo.name} — интерактивная карта</div>{state === "loading" && <div className="map-loading" role="status"><span className="map-loading__pulse" /> Загружаем карту и объекты…</div>}{state === "fallback" ? <div className="map-fallback map-fallback--interactive" aria-label={`Интерактивная схема объектов в ${cityInfo.prepositional}`}><div className="map-fallback__viewport" style={{ transform: `scale(${fallbackZoom})` }}>{properties.map((property, index) => <button type="button" className="map-fallback__marker" key={property.id} style={{ left: `${24 + (index * 23) % 62}%`, top: `${26 + (index * 19) % 54}%` }} onClick={() => window.location.assign(`/listing/${property.id}`)} aria-label={`${property.title}: ${formatRubles(property.price)}`}>{Math.round(property.price / 1000)}K</button>)}</div><div className="map-fallback__controls" aria-label="Масштаб карты"><button type="button" onClick={() => setFallbackZoom((value) => Math.min(1.35, value + .15))} aria-label="Увеличить карту"><Plus size={17} /></button><button type="button" onClick={() => setFallbackZoom((value) => Math.max(.85, value - .15))} aria-label="Уменьшить карту"><Minus size={17} /></button></div><p><MapPin size={17} /> Нажмите на маркер, чтобы открыть карточку объекта.</p></div> : <MapView key={city} initialCenter={cityInfo.center} initialZoom={cityInfo.zoom} className="property-map__canvas" onMapReady={(map) => { mapRef.current = map; renderMarkers(map); setState("ready"); }} onMapError={() => setState("fallback")} />}</section>;
}
