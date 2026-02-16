import { TOTAL_QURAN_PAGES } from "@/core/constants";
import { DailyWird, KhatmaPlan } from "@/core/types";

export function buildWirdSchedule(durationDays: number, totalPages = TOTAL_QURAN_PAGES): DailyWird[] {
  const basePages = Math.floor(totalPages / durationDays);
  const remainder = totalPages % durationDays;

  const result: DailyWird[] = [];
  let currentStart = 1;

  for (let day = 1; day <= durationDays; day += 1) {
    const bonus = day <= remainder ? 1 : 0;
    const pagesCount = basePages + bonus;
    const endPage = currentStart + pagesCount - 1;

    result.push({
      day,
      startPage: currentStart,
      endPage,
      pagesCount,
    });

    currentStart = endPage + 1;
  }

  return result;
}

export function buildKhatmaPlan(durationDays: 10 | 20 | 30, startDate: string, reminderTime: string): KhatmaPlan {
  return {
    id: crypto.randomUUID(),
    startDate,
    durationDays,
    totalPages: TOTAL_QURAN_PAGES,
    pagesPerDay: Number((TOTAL_QURAN_PAGES / durationDays).toFixed(2)),
    currentPage: 1,
    reminderTime,
  };
}

export function getCurrentDay(startDate: string, now = new Date()): number {
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  const ms = today.getTime() - start.getTime();
  const days = Math.floor(ms / 86_400_000) + 1;
  return days;
}

export function getTodayWird(plan: KhatmaPlan, now = new Date()): DailyWird | null {
  const day = getCurrentDay(plan.startDate, now);
  if (day < 1 || day > plan.durationDays) {
    return null;
  }
  const schedule = buildWirdSchedule(plan.durationDays, plan.totalPages);
  return schedule[day - 1] ?? null;
}

export function progressPercent(currentPage: number, totalPages = TOTAL_QURAN_PAGES): number {
  const bounded = Math.max(1, Math.min(currentPage, totalPages));
  return Math.round((bounded / totalPages) * 100);
}

export function pageToJuz(page: number): number {
  return Math.max(1, Math.min(30, Math.ceil((page / TOTAL_QURAN_PAGES) * 30)));
}
