/** Figma fidelity: светлый интерфейс Аренда БЕЗ; карточка объекта с фотографией, статусом, ценой и синим акцентом. */
import { Link } from "wouter";
import { MapPin, Star } from "lucide-react";
import { availabilityLabel, formatRubles, type Property } from "@/lib/domain";

export function PropertyCard({ property }: { property: Property }) {
  return (
    <article className="property-card">
      <Link href={`/listing/${property.id}`} className="property-card__image-link" aria-label={`Открыть: ${property.title}`}>
        <img
          src={property.images[0]}
          alt={`Интерьер: ${property.title}`}
          width="600"
          height="400"
          loading="lazy"
          decoding="async"
          className="property-card__image"
        />
        <span className={`status-badge status-badge--${property.status}`}>Без залога</span>
        {property.verified && <span className="verified-badge">Проверено</span>}
      </Link>
      <div className="property-card__body">
        <div className="property-card__meta">
          <span>{property.rooms}-комн.</span><span>{property.area} м²</span><span>{property.floor}</span>
        </div>
        <Link href={`/listing/${property.id}`} className="property-card__title">{property.title}</Link>
        <p className="property-card__address"><MapPin size={14} aria-hidden="true" /> {property.address}</p>
        <p className="property-card__rating"><Star size={14} fill="currentColor" aria-hidden="true" /> {property.rating} <span>({property.reviews} отзывов)</span> · {property.district.replace(", Казань", "")}</p>
        <p className="property-card__price">{formatRubles(property.price)} <span>/мес</span></p>
        <p className="property-card__fee">+ {formatRubles(Math.round(property.price * 0.1))} сервисный сбор</p>
      </div>
    </article>
  );
}
