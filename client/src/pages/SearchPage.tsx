/** Figma fidelity: светлый интерфейс Аренда БЕЗ; desktop-каталог с картой и mobile-последовательность «фильтры → карта → список». */
import { ChevronDown, ListFilter, Map, Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { AppShell } from "@/components/AppShell";
import { PropertyCard } from "@/components/PropertyCard";
import { PropertyMap } from "@/components/PropertyMap";
import { Seo } from "@/components/Seo";
import { filterProperties, properties, type PropertyFilters } from "@/lib/domain";

const DEFAULT_FILTERS: PropertyFilters = { query: "", rooms: "all", maxPrice: 100000, rentalType: "long", availability: "all" };

function filtersFromLocation(): PropertyFilters {
  const params = new URLSearchParams(window.location.search);
  const rooms = params.get("rooms");
  const rentalType = params.get("term") === "daily" ? "daily" : "long";
  return {
    query: params.get("q") ?? "",
    rooms: rooms === "1" || rooms === "2" || rooms === "3" ? rooms : "all",
    maxPrice: Number(params.get("max")) || 100000,
    rentalType,
    availability: "all",
  };
}

export default function SearchPage() {
  const [, navigate] = useLocation();
  const [filters, setFilters] = useState<PropertyFilters>(filtersFromLocation);
  const [mapVisible, setMapVisible] = useState(true);
  const results = useMemo(() => filterProperties(properties, filters), [filters]);

  function updateFilters(partial: Partial<PropertyFilters>) {
    const next = { ...filters, ...partial };
    setFilters(next);
    const params = new URLSearchParams();
    if (next.query) params.set("q", next.query);
    if (next.rooms !== "all") params.set("rooms", next.rooms);
    if (next.maxPrice !== 100000) params.set("max", String(next.maxPrice));
    if (next.rentalType !== "long") params.set("term", next.rentalType);
    navigate(`/search${params.size ? `?${params}` : ""}`, { replace: true });
  }

  return (
    <AppShell>
      <Seo title="Найти квартиру в Казани" description="Каталог проверенных квартир в Казани: фильтры по району, комнатам и бюджету, прозрачные условия аренды." />
      <section className="search-page">
        <div className="search-bar-wrap">
          <div className="rental-toggle" role="group" aria-label="Срок аренды">
            <button className={filters.rentalType === "long" ? "is-active" : ""} onClick={() => updateFilters({ rentalType: "long" })} type="button">Длительный срок</button>
            <button className={filters.rentalType === "daily" ? "is-active" : ""} onClick={() => updateFilters({ rentalType: "daily" })} type="button">Посуточно</button>
          </div>
          <div className="search-control">
            <Search size={19} aria-hidden="true" />
            <label className="sr-only" htmlFor="property-search">Район, адрес или метро</label>
            <input id="property-search" value={filters.query} onChange={(event) => updateFilters({ query: event.target.value })} placeholder="Район, адрес или метро" />
          </div>
          <label className="select-control">
            <span className="sr-only">Количество комнат</span>
            <select value={filters.rooms} onChange={(event) => updateFilters({ rooms: event.target.value as PropertyFilters["rooms"] })}>
              <option value="all">Комнаты</option><option value="1">1 комната</option><option value="2">2 комнаты</option><option value="3">3 комнаты</option>
            </select>
            <ChevronDown size={16} aria-hidden="true" />
          </label>
          <label className="select-control select-control--budget">
            <span className="sr-only">Бюджет</span>
            <select value={filters.maxPrice} onChange={(event) => updateFilters({ maxPrice: Number(event.target.value) })}>
              <option value="100000">Бюджет</option><option value="30000">До 30 000 ₽</option><option value="40000">До 40 000 ₽</option><option value="50000">До 50 000 ₽</option>
            </select>
            <ChevronDown size={16} aria-hidden="true" />
          </label>
          <button type="button" className="map-toggle" onClick={() => setMapVisible((value) => !value)} aria-pressed={mapVisible}>
            {mapVisible ? <Map size={17} aria-hidden="true" /> : <ListFilter size={17} aria-hidden="true" />}
            {mapVisible ? "Карта" : "Список"}
          </button>
        </div>

        <div className="search-layout">
          <section className="search-results" aria-labelledby="results-heading">
            <div className="results-heading">
              <div><p className="eyebrow">Проверенные квартиры</p><h1 id="results-heading">{results.length} {results.length === 1 ? "вариант" : "варианта"} в Казани</h1></div>
              <button type="button" className="filter-summary"><SlidersHorizontal size={16} aria-hidden="true" /> Фильтры</button>
            </div>
            {results.length ? (
              <div className="property-grid">
                {results.map((property) => <PropertyCard property={property} key={property.id} />)}
              </div>
            ) : (
              <div className="empty-results" role="status">
                <Map size={30} aria-hidden="true" />
                <h2>Подходящих квартир пока нет</h2>
                <p>Измените срок, комнатность или бюджет — каталог сразу обновится.</p>
                <button type="button" className="button button--secondary" onClick={() => updateFilters(DEFAULT_FILTERS)}>Сбросить фильтры</button>
              </div>
            )}
          </section>
          {mapVisible && <PropertyMap properties={results} />}
        </div>
      </section>
    </AppShell>
  );
}
