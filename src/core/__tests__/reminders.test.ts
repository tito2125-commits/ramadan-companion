import { describe, expect, it } from "vitest";
import { normalizeReminderPreferences } from "@/core/reminders";

describe("normalizeReminderPreferences", () => {
  it("normalizes invalid values and keeps valid channels", () => {
    const normalized = normalizeReminderPreferences({
      wirdTime: "7:5",
      morningAthkarTime: "99:78",
      prePrayerMinutes: 300,
      enabledChannels: ["push", "in-app"],
      timezone: "Asia/Riyadh",
    });

    expect(normalized.wirdTime).toBe("07:05");
    expect(normalized.morningAthkarTime).toBe("23:59");
    expect(normalized.prePrayerMinutes).toBe(60);
    expect(normalized.enabledChannels).toEqual(["push", "in-app"]);
  });
});
