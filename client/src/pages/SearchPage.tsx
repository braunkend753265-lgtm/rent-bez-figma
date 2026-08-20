import { ChevronDown, Heart, List, Map, Search, SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { AppShell } from "@/components/AppShell";
import { PropertyCard } from "@/components/PropertyCard";
import { PropertyMap } from "@/components/PropertyMap";
import { Seo } from "@/components/Seo";
import { useCity } from "@/contexts/CityContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { filterProperties, properties, type PropertyFilters } from "@/lib/domain";
import { DEFAULT_SEARCH_FILTERS, filtersFromSearch } from "@/lib/searchFilters";
import "./search-filters.css";

const DEFAULT_FILTERS = DEFAULT_SEARCH_FILTERS;
function filtersFromLocation(): PropertyFilters { return filtersFromSearch(window.location.search); }
function shortPrice(value: number) { return `${Math.round(value / 1000)} тыс.`; }

export default function SearchPage() {
  const [, navigate] = useLocation();
  const [filters, setFilters] = useState<PropertyFilters>(filtersFromLocation);
  const [view, setView] = useState<"split" | "list" | "map">("split");
  const [budgetOpen, setBudgetOpen] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [favoritesOnly, setFavoritesOnly] = useState(() => new URLSearchParams(window.location.search).get("favorites") === "1");
  const { city, cityInfo } = useCity();
  const { ids: favoriteIds } = useFavorites();
  const results = useMemo(() => filterProperties(properties.filter((property) => property.city === city), filters), [city, filters]);
  const displayed = favoritesOnly ? results.filter((property) => favoriteIds.includes(property.id)) : results;
  const minPrice = filters.minPrice ?? 0;
  const maxPrice = filters.maxPrice;
  const budgetLabel = minPrice === 0 && maxPrice === 100000 ? "Бюджет" : minPrice === 0 ? `до ${shortPrice(maxPrice)}` : maxPrice === 100000 ? `от ${shortPrice(minPrice)}` : `${shortPrice(minPrice)}–${shortPrice(maxPrice)}`;
  const extraFilterCount = Number(filters.rooms !== "all") + Number((filters.minArea ?? 0) > 0 || (filters.maxArea ?? 200) < 200) + Number(filters.availability === "available");

  function makeUrl(next: PropertyFilters, onlyFavorites = favoritesOnly) {
    const params = new URLSearchParams({ city });
    if (next.query) params.set("q", next.query);
    if (next.rooms !== "all") params.set("rooms", next.rooms);
    if (next.minPrice) params.set("minPrice", String(next.minPrice));
    if (next.maxPrice !== 100000) params.set("max", String(next.maxPrice));
    if (next.minArea) params.set("minArea", String(next.minArea));
    if (next.maxArea !== 200) params.set("maxArea", String(next.maxArea));
    if (next.rentalType !== "long") params.set("term", next.rentalType);
    if (onlyFavorites) params.set("favorites", "1");
    return `/search?${params}`;
  }
  function updateFilters(partial: Partial<PropertyFilters>) { const next = { ...filters, ...partial }; setFilters(next); navigate(makeUrl(next), { replace: true }); }
  function updateFavoritesOnly(next: boolean) { setFavoritesOnly(next); navigate(makeUrl(filters, next), { replace: true }); }
  function openBudget() { setBudgetOpen((open) => !open); setAdvancedOpen(false); }
  function openAdvanced() { setAdvancedOpen((open) => !open); setBudgetOpen(false); }
  const inputNumber = (event: React.ChangeEvent<HTMLInputElement>) => Math.max(0, Number(event.target.value) || 0);
  const chooseBudget = (nextMin: number, nextMax: number) => updateFilters({ minPrice: nextMin, maxPrice: nextMax });
  const resetExtra = () => updateFilters({ rooms: "all", minArea: 0, maxArea: 200, availability: "all" });

  return <AppShell><Seo title={`Найти квартиру в ${cityInfo.prepositional}`} description={`Каталог проверенных квартир в ${cityInfo.prepositional}: фильтры по цене, площади, комнатам и району.`} /><section className="search-page"><div className="search-bar-wrap"><div className="rental-toggle" role="group" aria-label="Срок аренды"><button className={filters.rentalType === "long" ? "is-active" : ""} onClick={() => updateFilters({ rentalType: "long" })} type="button">Длительный срок</button><button className={filters.rentalType === "daily" ? "is-active" : ""} onClick={() => updateFilters({ rentalType: "daily" })} type="button">Посуточно</button></div><div className="search-control"><Search size={19} aria-hidden="true" /><label className="sr-only" htmlFor="property-search">Район, адрес или метро</label><input id="property-search" value={filters.query} onChange={(event) => updateFilters({ query: event.target.value })} placeholder="Район, адрес или метро" /></div><button type="button" className={`filter-summary budget-summary ${budgetOpen || budgetLabel !== "Бюджет" ? "is-active" : ""}`} onClick={openBudget} aria-expanded={budgetOpen}><span>{budgetLabel}</span><ChevronDown size={16} aria-hidden="true" /></button><button type="button" className={`filter-summary filters-trigger ${advancedOpen || extraFilterCount ? "is-active" : ""}`} onClick={openAdvanced} aria-expanded={advancedOpen}><SlidersHorizontal size={16} aria-hidden="true" /> Фильтры{extraFilterCount ? <span className="filter-summary__count">{extraFilterCount}</span> : null}</button><button type="button" className={`favorites-icon ${favoritesOnly ? "is-active" : ""}`} onClick={() => updateFavoritesOnly(!favoritesOnly)} aria-label={favoritesOnly ? "Показать все квартиры" : "Показать избранные квартиры"} aria-pressed={favoritesOnly} title="Избранные квартиры"><Heart size={17} fill={favoritesOnly ? "currentColor" : "none"} aria-hidden="true" />{favoriteIds.length ? <span>{favoriteIds.length}</span> : null}</button><div className="view-toggle" role="group" aria-label="Режим просмотра"><button type="button" className={view !== "map" ? "is-active" : ""} onClick={() => setView("list")}><List size={16} aria-hidden="true" /> Список</button><button type="button" className={view !== "list" ? "is-active" : ""} onClick={() => setView("map")}><Map size={16} aria-hidden="true" /> Карта</button></div></div>{budgetOpen && <div className="advanced-filters budget-panel" aria-label="Фильтр бюджета"><div className="filters-panel__title"><strong>Бюджет в месяц</strong><button type="button" className="filter-reset" onClick={() => chooseBudget(0, 100000)}><X size={15} /> Сбросить</button></div><div><label htmlFor="min-price">Цена от, ₽</label><input id="min-price" type="number" min="0" step="5000" value={minPrice || ""} onChange={(event) => updateFilters({ minPrice: inputNumber(event) })} placeholder="0" /></div><div><label htmlFor="max-price">Цена до, ₽</label><input id="max-price" type="number" min="0" step="5000" value={maxPrice || ""} onChange={(event) => updateFilters({ maxPrice: inputNumber(event) || 100000 })} placeholder="100 000" /></div><div className="budget-presets" aria-label="Быстрый выбор бюджета"><button type="button" className={minPrice === 0 && maxPrice === 30000 ? "is-active" : ""} onClick={() => chooseBudget(0, 30000)}>До 30 тыс.</button><button type="button" className={minPrice === 30000 && maxPrice === 50000 ? "is-active" : ""} onClick={() => chooseBudget(30000, 50000)}>30–50 тыс.</button><button type="button" className={minPrice === 50000 && maxPrice === 75000 ? "is-active" : ""} onClick={() => chooseBudget(50000, 75000)}>50–75 тыс.</button></div></div>}{advancedOpen && <div className="advanced-filters filters-panel" aria-label="Дополнительные фильтры"><div className="filters-panel__title"><strong>Дополнительные фильтры</strong><button type="button" className="filter-reset" onClick={resetExtra}><X size={15} /> Сбросить</button></div><div className="rooms-filter"><label>Количество комнат</label><div role="group" aria-label="Количество комнат"><button type="button" className={filters.rooms === "all" ? "is-active" : ""} onClick={() => updateFilters({ rooms: "all" })}>Любое</button><button type="button" className={filters.rooms === "1" ? "is-active" : ""} onClick={() => updateFilters({ rooms: "1" })}>1</button><button type="button" className={filters.rooms === "2" ? "is-active" : ""} onClick={() => updateFilters({ rooms: "2" })}>2</button><button type="button" className={filters.rooms === "3" ? "is-active" : ""} onClick={() => updateFilters({ rooms: "3" })}>3+</button></div></div><div><label htmlFor="min-area">Площадь от, м²</label><input id="min-area" type="number" min="0" step="5" value={filters.minArea || ""} onChange={(event) => updateFilters({ minArea: inputNumber(event) })} placeholder="0" /></div><div><label htmlFor="max-area">Площадь до, м²</label><input id="max-area" type="number" min="0" step="5" value={filters.maxArea || ""} onChange={(event) => updateFilters({ maxArea: inputNumber(event) || 200 })} placeholder="200" /></div><label className="availability-filter"><input type="checkbox" checked={filters.availability === "available"} onChange={(event) => updateFilters({ availability: event.target.checked ? "available" : "all" })} /> Только доступные для заселения</label></div>}<div className={`search-layout search-layout--${view}`}>{view !== "map" && <section className="search-results" aria-labelledby="results-heading"><div className="results-heading"><div><p className="eyebrow">{favoritesOnly ? "Избранные квартиры" : "Проверенные квартиры"}</p><h1 id="results-heading">{displayed.length} {displayed.length === 1 ? "квартира" : "квартир"} в {cityInfo.prepositional}</h1></div></div>{displayed.length ? <div className="property-grid">{displayed.map((property) => <PropertyCard property={property} key={property.id} />)}</div> : <div className="empty-results" role="status"><Map size={30} aria-hidden="true" /><h2>{favoritesOnly ? "В избранном пока нет квартир" : "Подходящих квартир пока нет"}</h2><p>{favoritesOnly ? "Добавляйте понравившиеся объекты сердечком на карточке." : "Измените бюджет, площадь, комнатность или район — каталог сразу обновится."}</p>{favoritesOnly ? <button type="button" className="button button--secondary" onClick={() => updateFavoritesOnly(false)}>Показать все квартиры</button> : <button type="button" className="button button--secondary" onClick={() => { updateFilters(DEFAULT_FILTERS); setBudgetOpen(false); setAdvancedOpen(false); }}>Сбросить фильтры</button>}</div>}</section>}{view !== "list" && <PropertyMap city={city} properties={displayed} />}</div></section></AppShell>;
}
