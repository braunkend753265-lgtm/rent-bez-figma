import { describe, expect, it } from "vitest";
import { calculateOwnerEconomics, filterProperties, properties } from "./domain";

describe("filterProperties", () => {
  it("returns only available two-room apartments within a stated budget", () => {
    const result = filterProperties(properties, {
      query: "",
      rooms: "2",
      maxPrice: 40000,
      rentalType: "long",
      availability: "available",
    });

    expect(result).toHaveLength(1);
    expect(result[0]?.id).toBe("yamasheva-2");
  });

  it("matches a neighbourhood query regardless of case", () => {
    const result = filterProperties(properties, {
      query: "БАУМАНА",
      rooms: "all",
      maxPrice: 100000,
      rentalType: "long",
    });

    expect(result.map((property) => property.id)).toContain("baumana-1");
  });
});

describe("calculateOwnerEconomics", () => {
  it("splits a 10 percent service fee without reducing the owner rate", () => {
    expect(calculateOwnerEconomics(50000)).toEqual({
      ownerIncome: 50000,
      tenantMonthlyTotal: 55000,
      serviceFee: 5000,
    });
  });

  it("never returns negative values", () => {
    expect(calculateOwnerEconomics(-10)).toEqual({
      ownerIncome: 0,
      tenantMonthlyTotal: 0,
      serviceFee: 0,
    });
  });
});
