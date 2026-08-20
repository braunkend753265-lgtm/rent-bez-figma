/** Figma reference data: canonical rental cards, listing details and pricing used across responsive routes. */
export type RentalType = "long" | "daily";
export type Availability = "available" | "shows" | "rented";

export type Property = {
  id: string;
  title: string;
  district: string;
  address: string;
  metro: string;
  rooms: number;
  area: number;
  floor: string;
  price: number;
  rating: string;
  reviews: number;
  status: Availability;
  verified: boolean;
  deposit: number;
  description: string;
  amenities: string[];
  images: string[];
  coordinates: { x: number; y: number };
};

export type PropertyFilters = {
  query: string;
  rooms: "all" | "1" | "2" | "3";
  maxPrice: number;
  rentalType: RentalType;
  availability?: "all" | "available";
};

export const propertyImage = {
  living: "/manus-storage/rentbez-apartment-living-room_b7676013.jpg",
  kitchen: "/manus-storage/rentbez-apartment-kitchen_70e1d15f.jpg",
  bedroom: "/manus-storage/rentbez-apartment-bedroom_ea8e0dde.jpg",
} as const;

export const properties: Property[] = [
  { id:"baumana-1", title:"1-комнатная квартира на Баумана", district:"Вахитовский район, Казань", address:"ул. Баумана, 15", metro:"Кремлёвская, 5 мин", rooms:1, area:38, floor:"4 из 9", price:28000, rating:"4.9", reviews:12, status:"available", verified:true, deposit:0, description:"Светлая однокомнатная квартира в историческом центре города. Свежий ремонт 2023 года, встроенная кухня, качественная мебель и бытовая техника. Высокие потолки, большие окна с видом на тихий двор. Рядом Кремль, пешеходная улица Баумана, кафе и магазины.", amenities:["Стиральная машина","Посудомоечная машина","Кондиционер","Интернет 100 Мбит/с","Мебель","Холодильник"], images:[propertyImage.living,propertyImage.kitchen,propertyImage.bedroom], coordinates:{x:69,y:47} },
  { id:"yamasheva-2", title:"2-комнатная квартира на Ямашева", district:"Ново-Савиновский район, Казань", address:"пр. Ямашева, 101", metro:"Яшьлек, 8 мин", rooms:2, area:56, floor:"7 из 14", price:38000, rating:"4.8", reviews:8, status:"available", verified:true, deposit:0, description:"Просторная двухкомнатная квартира с удобной планировкой в спальном районе. Тихий дом, хорошие соседи, ухоженный подъезд. Балкон с видом на парк. Рядом торговый центр, детский сад и школа.", amenities:["Стиральная машина","Кондиционер","Интернет 100 Мбит/с","Мебель","Холодильник","Телевизор"], images:[propertyImage.kitchen,propertyImage.bedroom,propertyImage.living], coordinates:{x:50,y:32} },
  { id:"chistopolskaya-studio", title:"Студия, Советский район", district:"Советский район, Казань", address:"ул. Чистопольская, 67", metro:"Горки, 12 мин", rooms:1, area:28, floor:"3 из 16", price:22000, rating:"4.7", reviews:9, status:"shows", verified:true, deposit:0, description:"Светлая студия с необходимой техникой, мебелью и понятными условиями долгосрочной аренды.", amenities:["Стиральная машина","Интернет 100 Мбит/с","Холодильник","Лифт"], images:[propertyImage.kitchen,propertyImage.living,propertyImage.bedroom], coordinates:{x:56,y:56} },
  { id:"sibirsky-2", title:"2-комн. квартира, Приволжский", district:"Приволжский район, Казань", address:"ул. Сибирский тракт, 34", metro:"Проспект Победы, 6 мин", rooms:2, area:52, floor:"5 из 10", price:35000, rating:"4.9", reviews:14, status:"shows", verified:true, deposit:0, description:"Квартира с удобной планировкой, закрытым двором и готовой инфраструктурой для спокойной аренды.", amenities:["Стиральная машина","Посудомоечная машина","Кондиционер","Закрытый двор","Лифт"], images:[propertyImage.living,propertyImage.bedroom,propertyImage.kitchen], coordinates:{x:63,y:72} },
  { id:"pobezhimova-3", title:"3-комн. квартира, Авиастроительный", district:"Авиастроительный район, Казань", address:"ул. Побежимова, 47", metro:"нет метро", rooms:3, area:78, floor:"6 из 12", price:48000, rating:"4.6", reviews:6, status:"shows", verified:true, deposit:0, description:"Просторная квартира для семьи: светлые комнаты, тихий двор и понятные условия долгосрочной аренды.", amenities:["Интернет 100 Мбит/с","Кондиционер","Парковка","Лифт"], images:[propertyImage.kitchen,propertyImage.living,propertyImage.bedroom], coordinates:{x:26,y:24} },
  { id:"dekabristov-1", title:"1-комн. квартира, Московский район", district:"Московский район, Казань", address:"ул. Декабристов, 180", metro:"нет метро", rooms:1, area:40, floor:"2 из 5", price:26000, rating:"4.8", reviews:11, status:"shows", verified:true, deposit:0, description:"Аккуратная квартира с мебелью и бытовой техникой недалеко от городской инфраструктуры.", amenities:["Стиральная машина","Телевизор","Балкон","Холодильник"], images:[propertyImage.bedroom,propertyImage.living,propertyImage.kitchen], coordinates:{x:38,y:53} },
];

export const availabilityLabel: Record<Availability, string> = { available:"Проверено", shows:"Проверено", rented:"Сдана" };

export function filterProperties(source: Property[], filters: PropertyFilters): Property[] {
  if (filters.rentalType !== "long") return [];
  const normalizedQuery = filters.query.trim().toLocaleLowerCase("ru-RU");
  return source.filter((property) => {
    const matchesQuery = !normalizedQuery || [property.title, property.district, property.address, property.metro].join(" ").toLocaleLowerCase("ru-RU").includes(normalizedQuery);
    const matchesRooms = filters.rooms === "all" || property.rooms === Number(filters.rooms);
    const matchesPrice = property.price <= filters.maxPrice;
    const matchesAvailability = filters.availability !== "available" || property.status === "available";
    return matchesQuery && matchesRooms && matchesPrice && matchesAvailability && property.status !== "rented";
  });
}

export function calculateOwnerEconomics(rate: number) {
  const ownerIncome = Math.max(0, Math.round(Number.isFinite(rate) ? rate : 0));
  const serviceFee = Math.round(ownerIncome * 0.1);
  return { ownerIncome, tenantMonthlyTotal: ownerIncome + serviceFee, serviceFee };
}

export function formatRubles(value: number) { return new Intl.NumberFormat("ru-RU", { maximumFractionDigits:0, style:"currency", currency:"RUB" }).format(value); }
