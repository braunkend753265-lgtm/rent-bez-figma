/** Figma fidelity: светлый интерфейс Аренда БЕЗ; галерея объекта, ясные условия, сервисный сбор и sticky CTA. */
import { Check, ChevronLeft, CircleCheck, Heart, MapPin, ShieldCheck, Sparkles, Star } from "lucide-react";
import { Link } from "wouter";
import { AppShell } from "@/components/AppShell";
import { ApplicationDialog } from "@/components/ApplicationDialog";
import { Seo } from "@/components/Seo";
import { availabilityLabel, formatRubles, properties } from "@/lib/domain";
import { useState } from "react";
import { useFavorites } from "@/contexts/FavoritesContext";

export default function ListingPage({ id }: { id: string }) {
  const property = properties.find((item) => item.id === id);
  const [applicationOpen, setApplicationOpen] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();

  if (!property) {
    return (
      <AppShell><section className="not-found-page"><h1>Квартира не найдена</h1><p>Возможно, объект снят с публикации или ссылка устарела.</p><Link href="/search" className="button button--primary">Вернуться к поиску</Link></section></AppShell>
    );
  }

  const availableForApplication = property.status !== "rented";
  return (
    <AppShell>
      <Seo title={property.title} description={`${property.title}, ${property.district}. ${formatRubles(property.price)} в месяц; проверенные условия аренды в Казани.`} />
      <section className="listing-page">
        <div className="listing-breadcrumbs"><Link href="/search"><ChevronLeft size={16} aria-hidden="true" /> Все квартиры</Link><span>/</span><span>{property.district}</span></div>
        <div className="listing-topline"><div><p className="eyebrow">{availabilityLabel[property.status]} · Без залога</p><h1>{property.title}</h1><p className="listing-location"><Star size={15} fill="currentColor" aria-hidden="true" /> {property.rating} ({property.reviews} отзывов) · {property.district}</p><p className="listing-location"><MapPin size={16} aria-hidden="true" /> {property.address} · {property.area} м² · {property.floor} эт.</p></div><div className="listing-topline__actions"><button type="button" className={`favorite-button favorite-button--listing ${isFavorite(property.id) ? "is-saved" : ""}`} aria-label={isFavorite(property.id) ? "Убрать из избранного" : "Добавить в избранное"} aria-pressed={isFavorite(property.id)} onClick={() => toggleFavorite(property.id)}><Heart size={19} fill={isFavorite(property.id) ? "currentColor" : "none"} aria-hidden="true" /></button><span className="verified-label"><ShieldCheck size={17} aria-hidden="true" /> Проверено</span></div></div>
        <div className="listing-layout">
          <article className="listing-content">
            <div className="listing-gallery">
              <img src={property.images[0]} width="1200" height="700" fetchPriority="high" alt={`Главное фото: ${property.title}`} className="listing-gallery__main" />
              <div className="listing-gallery__side"><img src={property.images[1]} width="600" height="400" loading="lazy" alt={`Фото кухни: ${property.title}`} /><img src={property.images[2]} width="600" height="400" loading="lazy" alt={`Фото спальни: ${property.title}`} /></div>
            </div>
            <div className="facts-row"><span>Площадь: {property.area} м²</span><span>Этаж: {property.floor}</span><span>Комнат: {property.rooms}</span><span>Метро: {property.metro}</span></div>
            <section className="listing-section"><h2>О квартире</h2><p>{property.description}</p></section>
            <section className="listing-section"><h2>Что есть в квартире</h2><ul className="amenity-list">{property.amenities.map((amenity) => <li key={amenity}><Check size={16} aria-hidden="true" /> {amenity}</li>)}</ul></section>
            <section className="listing-section conditions"><h2>Условия аренды</h2><dl><div><dt>Арендная плата</dt><dd>{formatRubles(property.price)}/мес</dd></div><div><dt>Сервисный сбор</dt><dd>{formatRubles(Math.round(property.price * 0.1))}/мес</dd></div><div><dt>Залог при заселении</dt><dd>{property.deposit === 0 ? "0 ₽" : formatRubles(property.deposit)}</dd></div><div><dt>Срок аренды</dt><dd>от 6 месяцев</dd></div><div><dt>Договор</dt><dd>Онлайн, без нотариуса</dd></div><div><dt>Коммунальные услуги</dt><dd>По счётчикам</dd></div></dl></section>
            <section className="listing-section listing-guarantee"><Sparkles size={20} aria-hidden="true" /><div><h2>Договор с каждым арендатором</h2><p>Понятный, предсказуемый процесс без сюрпризов. Условия зафиксированы онлайн.</p></div></section>
            <section className="listing-section location-panel"><h2>Расположение</h2><div className="location-panel__map"><MapPin size={20} aria-hidden="true" /><span>{property.address}</span></div></section>
          </article>
          <aside className="price-card"><p className="price-card__main">{formatRubles(property.price)} <span>/мес</span></p><p className="price-card__total">+ {formatRubles(Math.round(property.price * 0.1))} сервисный сбор</p><ul><li><CircleCheck size={16} aria-hidden="true" /> без залога — 0 ₽ при заселении</li><li><CircleCheck size={16} aria-hidden="true" /> квартира проверена сервисом</li><li><CircleCheck size={16} aria-hidden="true" /> договор онлайн</li></ul>{availableForApplication ? <button type="button" className="button button--primary button--wide" onClick={() => setApplicationOpen(true)}>Оставить заявку</button> : <button type="button" className="button button--secondary button--wide" disabled>Квартира уже сдана</button>}<p className="form-note">Ответим в течение часа в рабочее время.</p></aside>
        </div>
      </section>
      {applicationOpen && <ApplicationDialog property={property} onClose={() => setApplicationOpen(false)} />}
    </AppShell>
  );
}
