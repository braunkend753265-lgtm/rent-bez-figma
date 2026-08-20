import { describe, expect, it } from "vitest";
import { normalizeFavoriteIds, toggleFavoriteId } from "./favorites";

describe("favorites helpers", () => {
  it("adds and removes a property ID deterministically", () => {
    expect(toggleFavoriteId([], "baumana-1")).toEqual(["baumana-1"]);
    expect(toggleFavoriteId(["baumana-1"], "baumana-1")).toEqual([]);
  });

  it("normalizes persisted values without duplicates or non-string data", () => {
    expect(normalizeFavoriteIds(["baumana-1", "baumana-1", 42, ""])).toEqual(["baumana-1"]);
  });
});
