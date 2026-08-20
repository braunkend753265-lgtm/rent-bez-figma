import { useCallback, useEffect, useState } from "react";
import { MapPin, Minus, Plus } from "lucide-react";
import { cities, type CityId } from "@/contexts/CityContext";
import { YandexMap } from "@/components/YandexMap";
import { formatRubles, type Property } from "@/lib/domain";

export function PropertyMap({ properties, city }: { properties: Property[]; city: CityId }) {
  const [state, setState] = useState<"loading" | "ready" | "fallback">("loading");
  const [fallbackZoom, setFallbackZoom] = useState(1);
  const cityInfo = cities[city];
  useEffect(() => { setState(import.meta.env.VITE_YANDEX_MAPS_API_KEY ? "loading" : "fallback"); setFallbackZoom(1); }, [city]);
  const onReady = useCallback(() => setState("ready"), []);
  const onError = useCallback(() => setState("fallback"), []);
  return <section className="property-map property-map--interactive" aria-label={`Карта объектов: ${cityInfo.name}`}><div className="property-map__label">{cityInfo.name} — Яндекс Карты</div>{state === "loading" && <div className="map-loading" role="status"><span className="map-loading__pulse" /> Загружаем Яндекс Карты…</div>}{state !== "fallback" && <YandexMap center={cityInfo.center} zoom={cityInfo.zoom} properties={properties} onReady={onReady} onError={onError} />}{state === "fallback" && <div className="map-fallback map-fallback--interactive" aria-label={`Интерактивная схема объектов в ${cityInfo.prepositional}`}><div className="map-fallback__viewport" style={{ transform: `scale(${fallbackZoom})` }}>{properties.map((property, index) => <button type="button" className="map-fallback__marker" key={property.id} style={{ left: `${24 + (index * 23) % 62}%`, top: `${26 + (index * 19) % 54}%` }} onClick={() => window.location.assign(`/listing/${property.id}`)} aria-label={`${property.title}: ${formatRubles(property.price)}`}>{Math.round(property.price / 1000)}K</button>)}</div><div className="map-fallback__controls" aria-label="Масштаб карты"><button type="button" onClick={() => setFallbackZoom((value) => Math.min(1.35, value + .15))} aria-label="Увеличить карту"><Plus size={17} /></button><button type="button" onClick={() => setFallbackZoom((value) => Math.max(.85, value - .15))} aria-label="Уменьшить карту"><Minus size={17} /></button></div><p><MapPin size={17} /> Нажмите на маркер, чтобы открыть карточку объекта.</p></div>}</section>;
}
