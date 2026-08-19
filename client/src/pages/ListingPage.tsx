/** Figma fidelity: светлый интерфейс Аренда БЕЗ; галерея объекта, ясные условия, сервисный сбор и sticky CTA. */
import { Check, ChevronLeft, CircleCheck, MapPin, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { AppShell } from "@/components/AppShell";
import { ApplicationDialog } from "@/components/ApplicationDialog";
import { Seo } from "@/components/Seo";
import { availabilityLabel, formatRubles, properties } from "@/lib/domain";
import { useState } from "react";

export default function ListingPage({ id }: { id: string }) {
  const property = properties.find((item) => item.id === id);
  const [applicationOpen, setApplicationOpen] = useState(false);

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
        <div className="listing-topline"><div><p className="eyebrow">{availabilityLabel[property.status]}</p><h1>{property.title}</h1><p className="listing-location"><MapPin size={16} aria-hidden="true" /> {property.address} · {property.metro}</p></div><span className="verified-label"><ShieldCheck size={17} aria-hidden="true" /> Проверено сервисом</span></div>
        <div className="listing-layout">
          <article className="listing-content">
            <div className="listing-gallery">
              <img src={property.images[0]} width="1200" height="700" fetchPriority="high" alt={`Главное фото: ${property.title}`} className="listing-gallery__main" />
              <div className="listing-gallery__side"><img src={property.images[1]} width="600" height="400" loading="lazy" alt={`Фото кухни: ${property.title}`} /><img src={property.images[2]} width="600" height="400" loading="lazy" alt={`Фото спальни: ${property.title}`} /></div>
            </div>
            <div className="facts-row"><span>{property.rooms} комнаты</span><span>{property.area} м²</span><span>{property.floor} этаж</span><span>{property.metro}</span></div>
            <section className="listing-section"><h2>О квартире</h2><p>{property.description}</p></section>
            <section className="listing-section"><h2>Что есть в квартире</h2><ul className="amenity-list">{property.amenities.map((amenity) => <li key={amenity}><Check size={16} aria-hidden="true" /> {amenity}</li>)}</ul></section>
            <section className="listing-section conditions"><h2>Условия аренды</h2><dl><div><dt>Арендная плата</dt><dd>{formatRubles(property.price)} в месяц</dd></div><div><dt>Сервисный сбор</dt><dd>{formatRubles(Math.round(property.price * 0.1))} в месяц</dd></div><div><dt>Залог при заселении</dt><dd>{property.deposit === 0 ? "0 ₽" : formatRubles(property.deposit)}</dd></div><div><dt>Договор</dt><dd>Онлайн, с понятными условиями</dd></div></dl></section>
            <section className="listing-section listing-guarantee"><Sparkles size={20} aria-hidden="true" /><div><h2>Без лишней комиссии и неопределённости</h2><p>Сервис проверяет объект, помогает с показом и остаётся точкой поддержки после заселения.</p></div></section>
            <section className="listing-section location-panel"><h2>Расположение</h2><div className="location-panel__map"><MapPin size={20} aria-hidden="true" /><span>{property.address}</span></div></section>
          </article>
          <aside className="price-card"><p className="price-card__main">{formatRubles(property.price)} <span>/ мес</span></p><p className="price-card__total">Итого с сервисом: {formatRubles(Math.round(property.price * 1.1))}</p><ul><li><CircleCheck size={16} aria-hidden="true" /> договор и условия прозрачны</li><li><CircleCheck size={16} aria-hidden="true" /> без залога</li><li><CircleCheck size={16} aria-hidden="true" /> показ проводит менеджер</li></ul>{availableForApplication ? <button type="button" className="button button--primary button--wide" onClick={() => setApplicationOpen(true)}>Оставить заявку</button> : <button type="button" className="button button--secondary button--wide" disabled>Квартира уже сдана</button>}<p className="form-note">Предварительная анкета занимает до 2 минут.</p></aside>
        </div>
      </section>
      {applicationOpen && <ApplicationDialog property={property} onClose={() => setApplicationOpen(false)} />}
    </AppShell>
  );
}
