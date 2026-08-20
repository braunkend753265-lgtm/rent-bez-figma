/** Figma fidelity: светлый интерфейс Аренда БЕЗ; карта Казани с нейтральной подложкой и ясными ценовыми маркерами. */
import { Link } from "wouter";
import { formatRubles, type Property } from "@/lib/domain";

export function PropertyMap({ properties }: { properties: Property[] }) {
  return (
    <section className="property-map" aria-label="Карта объектов в Казани">
      <div className="property-map__label">Казань — интерактивная карта</div>
      <div className="map-fallback" aria-label="Расположение объектов на схематичной карте Казани">
        <span className="map-fallback__river" aria-hidden="true" />
        <span className="map-fallback__road map-fallback__road--one" aria-hidden="true" />
        <span className="map-fallback__road map-fallback__road--two" aria-hidden="true" />
        <span className="map-fallback__district map-fallback__district--north">Авиастроительный</span>
        <span className="map-fallback__district map-fallback__district--center">Центр</span>
        <span className="map-fallback__district map-fallback__district--south">Приволжский</span>
        {properties.map((property) => (
          <Link
            href={`/listing/${property.id}`}
            className="map-fallback__marker"
            key={property.id}
            style={{ left: `${property.coordinates.x}%`, top: `${property.coordinates.y}%` }}
            aria-label={`${property.title}: ${formatRubles(property.price)}`}
          >
            {Math.round(property.price / 1000)}k
          </Link>
        ))}
      </div>
    </section>
  );
}
