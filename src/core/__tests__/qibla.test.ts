import { describe, expect, it } from "vitest";
import { getQiblaBearing } from "@/core/qibla";

describe("getQiblaBearing", () => {
  it("returns a valid bearing for Riyadh", () => {
    const bearing = getQiblaBearing(24.7136, 46.6753);
    expect(bearing).toBeGreaterThan(240);
    expect(bearing).toBeLessThan(250);
  });

  it("returns a valid bearing for Jeddah", () => {
    const bearing = getQiblaBearing(21.4858, 39.1925);
    expect(bearing).toBeGreaterThan(90);
    expect(bearing).toBeLessThan(110);
  });
});
