import { describe, expect, it } from "vitest";
import { buildWirdSchedule } from "@/core/khatma";

describe("buildWirdSchedule", () => {
  it("distributes all 604 pages across 30 days", () => {
    const schedule = buildWirdSchedule(30);
    expect(schedule).toHaveLength(30);

    const total = schedule.reduce((sum, day) => sum + day.pagesCount, 0);
    expect(total).toBe(604);
    expect(schedule[0].startPage).toBe(1);
    expect(schedule[29].endPage).toBe(604);
  });

  it("distributes all 604 pages across 20 days", () => {
    const schedule = buildWirdSchedule(20);
    expect(schedule).toHaveLength(20);
    expect(schedule.reduce((sum, day) => sum + day.pagesCount, 0)).toBe(604);
  });

  it("distributes all 604 pages across 10 days", () => {
    const schedule = buildWirdSchedule(10);
    expect(schedule).toHaveLength(10);
    expect(schedule.reduce((sum, day) => sum + day.pagesCount, 0)).toBe(604);
  });
});
