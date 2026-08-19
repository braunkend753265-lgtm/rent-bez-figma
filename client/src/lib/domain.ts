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

const sharedAmenities = ["Стиральная машина", "Интернет", "Холодильник", "Кондиционер"];

export const properties: Property[] = [
  {
    id: "baumana-1",
    title: "1-комнатная квартира на Баумана",
    district: "Вахитовский район",
    address: "ул. Баумана, 82",
    metro: "Кремлёвская · 5 мин",
    rooms: 1,
    area: 40,
    floor: "5 из 9",
    price: 28000,
    status: "available",
    verified: true,
    deposit: 0,
    description:
      "Светлая квартира рядом с центром. Сервис проверил состояние, фотографии и условия аренды.",
    amenities: sharedAmenities,
    images: [propertyImage.living, propertyImage.kitchen, propertyImage.bedroom],
    coordinates: { x: 69, y: 47 },
  },
  {
    id: "yamasheva-2",
    title: "2-комнатная квартира на Ямашева",
    district: "Ново-Савиновский район",
    address: "просп. Ямашева, 76",
    metro: "Козья слобода · 12 мин",
    rooms: 2,
    area: 75,
    floor: "7 из 14",
    price: 38000,
    status: "available",
    verified: true,
    deposit: 0,
    description:
      "Просторная двухкомнатная квартира с отдельной кухней и готовой инфраструктурой для семьи.",
    amenities: [...sharedAmenities, "Посудомоечная машина"],
    images: [propertyImage.kitchen, propertyImage.bedroom, propertyImage.living],
    coordinates: { x: 50, y: 32 },
  },
  {
    id: "moskovsky-1",
    title: "1-комнатная квартира, Московский район",
    district: "Московский район",
    address: "ул. Декабристов, 183",
    metro: "Яшьлек · 8 мин",
    rooms: 1,
    area: 34,
    floor: "3 из 10",
    price: 26000,
    status: "shows",
    verified: true,
    deposit: 0,
    description:
      "Квартира в показах: можно оставить анкету, чтобы менеджер предложил доступный слот.",
    amenities: ["Стиральная машина", "Интернет", "Лифт", "Балкон"],
    images: [propertyImage.bedroom, propertyImage.living, propertyImage.kitchen],
    coordinates: { x: 38, y: 53 },
  },
  {
    id: "privolzhsky-2",
    title: "2-комнатная квартира, Приволжский район",
    district: "Приволжский район",
    address: "ул. Рихарда Зорге, 48",
    metro: "Проспект Победы · 10 мин",
    rooms: 2,
    area: 61,
    floor: "8 из 16",
    price: 35000,
    status: "shows",
    verified: true,
    deposit: 0,
    description:
      "Удобная планировка, аккуратная отделка и прозрачная структура ежемесячной оплаты.",
    amenities: ["Интернет", "Кондиционер", "Гардеробная", "Лифт"],
    images: [propertyImage.living, propertyImage.bedroom, propertyImage.kitchen],
    coordinates: { x: 63, y: 72 },
  },
  {
    id: "aviastroitelny-3",
    title: "3-комнатная квартира, Авиастроительный",
    district: "Авиастроительный район",
    address: "ул. Белинского, 17",
    metro: "Авиастроительная · 11 мин",
    rooms: 3,
    area: 84,
    floor: "4 из 12",
    price: 48000,
    status: "rented",
    verified: true,
    deposit: 0,
    description:
      "Объект уже сдан. Карточка остаётся в каталоге как пример статуса и качества представления.",
    amenities: ["Интернет", "Кондиционер", "Посудомоечная машина", "Лоджия"],
    images: [propertyImage.kitchen, propertyImage.living, propertyImage.bedroom],
    coordinates: { x: 26, y: 24 },
  },
  {
    id: "sovetsky-1",
    title: "1-комнатная квартира, Советский район",
    district: "Советский район",
    address: "ул. Аделя Кутуя, 84",
    metro: "Горки · 14 мин",
    rooms: 1,
    area: 42,
    floor: "10 из 18",
    price: 29000,
    status: "available",
    verified: true,
    deposit: 0,
    description:
      "Тихий современный дом, готовый к просмотрам после короткой предварительной анкеты.",
    amenities: ["Стиральная машина", "Интернет", "Лифт", "Рабочее место"],
    images: [propertyImage.bedroom, propertyImage.kitchen, propertyImage.living],
    coordinates: { x: 78, y: 68 },
  },
];

export const availabilityLabel: Record<Availability, string> = {
  available: "На подбор",
  shows: "В показах",
  rented: "Сдана",
};

export function filterProperties(
  source: Property[],
  filters: PropertyFilters,
): Property[] {
  if (filters.rentalType !== "long") return [];

  const normalizedQuery = filters.query.trim().toLocaleLowerCase("ru-RU");
  return source.filter((property) => {
    const matchesQuery =
      !normalizedQuery ||
      [property.title, property.district, property.address, property.metro]
        .join(" ")
        .toLocaleLowerCase("ru-RU")
        .includes(normalizedQuery);
    const matchesRooms =
      filters.rooms === "all" || property.rooms === Number(filters.rooms);
    const matchesPrice = property.price <= filters.maxPrice;
    const matchesAvailability =
      filters.availability !== "available" || property.status === "available";
    return (
      matchesQuery &&
      matchesRooms &&
      matchesPrice &&
      matchesAvailability &&
      property.status !== "rented"
    );
  });
}

export function calculateOwnerEconomics(rate: number) {
  const ownerIncome = Math.max(0, Math.round(Number.isFinite(rate) ? rate : 0));
  const serviceFee = Math.round(ownerIncome * 0.1);
  return {
    ownerIncome,
    tenantMonthlyTotal: ownerIncome + serviceFee,
    serviceFee,
  };
}

export function formatRubles(value: number) {
  return new Intl.NumberFormat("ru-RU", {
    maximumFractionDigits: 0,
    style: "currency",
    currency: "RUB",
  }).format(value);
}
