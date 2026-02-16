import { DEFAULT_REMINDER_PREFERENCES } from "@/core/constants";
import { EnabledReminderChannel, ReminderPreferences } from "@/core/types";

export function normalizeReminderPreferences(input: Partial<ReminderPreferences>): ReminderPreferences {
  const channels = new Set<EnabledReminderChannel>(input.enabledChannels ?? DEFAULT_REMINDER_PREFERENCES.enabledChannels);

  const prePrayerMinutes = Number.isFinite(input.prePrayerMinutes)
    ? Math.max(0, Math.min(60, Number(input.prePrayerMinutes)))
    : DEFAULT_REMINDER_PREFERENCES.prePrayerMinutes;

  return {
    wirdTime: normalizeTime(input.wirdTime ?? DEFAULT_REMINDER_PREFERENCES.wirdTime),
    morningAthkarTime: normalizeTime(input.morningAthkarTime ?? DEFAULT_REMINDER_PREFERENCES.morningAthkarTime),
    eveningAthkarTime: normalizeTime(input.eveningAthkarTime ?? DEFAULT_REMINDER_PREFERENCES.eveningAthkarTime),
    prePrayerMinutes,
    enabledChannels: Array.from(channels).filter((item): item is EnabledReminderChannel => item === "push" || item === "in-app"),
    timezone: input.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone ?? DEFAULT_REMINDER_PREFERENCES.timezone,
  };
}

export function normalizeTime(value: string): string {
  const match = /^(\d{1,2}):(\d{1,2})$/.exec(value.trim());
  if (!match) {
    return "08:00";
  }
  const hours = Math.max(0, Math.min(23, Number(match[1])));
  const minutes = Math.max(0, Math.min(59, Number(match[2])));
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

export function isTimeMatch(targetTime: string, now = new Date()): boolean {
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}` === targetTime;
}
