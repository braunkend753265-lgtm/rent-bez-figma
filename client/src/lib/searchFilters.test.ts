import { describe, expect, it } from "vitest";
import { filterProperties, properties } from "@/lib/domain";
import { DEFAULT_SEARCH_FILTERS, filtersFromSearch } from "./searchFilters";

describe("search filter URL parsing", () => {
  it("keeps safe default limits when a URL has no filter parameters", () => {
    const filters = filtersFromSearch("");
    expect(filters).toEqual(DEFAULT_SEARCH_FILTERS);
    expect(filterProperties(properties.filter((property) => property.city === "kazan"), filters)).toHaveLength(6);
  });

  it("parses explicit numeric constraints while rejecting invalid values", () => {
    expect(filtersFromSearch("?minPrice=25000&max=45000&minArea=35&maxArea=60&rooms=2")).toMatchObject({ minPrice: 25000, maxPrice: 45000, minArea: 35, maxArea: 60, rooms: "2" });
    expect(filtersFromSearch("?max=invalid&maxArea=")).toMatchObject({ maxPrice: 100000, maxArea: 200 });
  });
});
