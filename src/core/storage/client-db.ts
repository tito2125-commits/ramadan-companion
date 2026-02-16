"use client";

import Dexie, { type EntityTable } from "dexie";
import {
  Bookmark,
  CachedPrayerTimes,
  DeviceLocation,
  KhatmaPlan,
  QuranSurah,
  QuranSurahPayload,
  ReadingProgress,
  ReminderPreferences,
} from "@/core/types";

interface KeyValueItem {
  key: string;
  value: unknown;
}

interface SurahCacheEntry {
  surahNumber: number;
  payload: QuranSurahPayload;
  fetchedAt: string;
}

interface SurahListCacheEntry {
  id: string;
  list: QuranSurah[];
  fetchedAt: string;
}

class RamadanDb extends Dexie {
  settings!: EntityTable<KeyValueItem, "key">;
  bookmarks!: EntityTable<Bookmark, "id">;
  khatmaPlans!: EntityTable<KhatmaPlan, "id">;
  readingProgress!: EntityTable<ReadingProgress, "surah">;
  prayerCache!: EntityTable<CachedPrayerTimes, "cacheKey">;
  surahCache!: EntityTable<SurahCacheEntry, "surahNumber">;
  surahListCache!: EntityTable<SurahListCacheEntry, "id">;

  constructor() {
    super("ramadan_companion");
    this.version(1).stores({
      settings: "&key",
      bookmarks: "++id, surah, ayah, createdAt",
      khatmaPlans: "&id, startDate",
      readingProgress: "surah, updatedAt",
      prayerCache: "&cacheKey, fetchedAt",
      surahCache: "&surahNumber, fetchedAt",
      surahListCache: "&id, fetchedAt",
    });
  }
}

export const db = new RamadanDb();

export async function getSetting<T>(key: string, fallback: T): Promise<T> {
  const row = await db.settings.get(key);
  return (row?.value as T) ?? fallback;
}

export async function setSetting<T>(key: string, value: T): Promise<void> {
  await db.settings.put({ key, value });
}

export async function getPrimaryKhatmaPlan(): Promise<KhatmaPlan | null> {
  const rows = await db.khatmaPlans.toArray();
  return rows[0] ?? null;
}

export async function saveKhatmaPlan(plan: KhatmaPlan): Promise<void> {
  await db.khatmaPlans.clear();
  await db.khatmaPlans.put(plan);
}

export async function updateCurrentPage(currentPage: number): Promise<void> {
  const plan = await getPrimaryKhatmaPlan();
  if (!plan) {
    return;
  }
  await db.khatmaPlans.put({ ...plan, currentPage });
}

export async function saveReadingProgress(progress: ReadingProgress): Promise<void> {
  await db.readingProgress.clear();
  await db.readingProgress.put(progress);
}

export async function getReadingProgress(): Promise<ReadingProgress | null> {
  const rows = await db.readingProgress.toArray();
  return rows[0] ?? null;
}

export async function addBookmark(entry: Omit<Bookmark, "id">): Promise<void> {
  await db.bookmarks.add(entry as Bookmark);
}

export async function deleteBookmark(id: number): Promise<void> {
  await db.bookmarks.delete(id);
}

export async function getBookmarks(): Promise<Bookmark[]> {
  return db.bookmarks.orderBy("createdAt").reverse().toArray();
}

export async function savePrayerCache(payload: CachedPrayerTimes): Promise<void> {
  await db.prayerCache.put(payload);
}

export async function getPrayerCache(cacheKey: string): Promise<CachedPrayerTimes | null> {
  return (await db.prayerCache.get(cacheKey)) ?? null;
}

export async function saveSurahPayload(payload: QuranSurahPayload): Promise<void> {
  await db.surahCache.put({
    surahNumber: payload.surah.number,
    payload,
    fetchedAt: new Date().toISOString(),
  });
}

export async function getSurahPayload(surahNumber: number): Promise<QuranSurahPayload | null> {
  return (await db.surahCache.get(surahNumber))?.payload ?? null;
}

export async function saveSurahList(list: QuranSurah[]): Promise<void> {
  await db.surahListCache.put({ id: "surah-list", list, fetchedAt: new Date().toISOString() });
}

export async function getSurahList(): Promise<QuranSurah[] | null> {
  return (await db.surahListCache.get("surah-list"))?.list ?? null;
}

export async function getSavedLocation(): Promise<DeviceLocation | null> {
  return getSetting<DeviceLocation | null>("location", null);
}

export async function saveLocation(location: DeviceLocation): Promise<void> {
  await setSetting("location", location);
}

export async function getReminderPreferences(): Promise<ReminderPreferences | null> {
  return getSetting<ReminderPreferences | null>("reminderPreferences", null);
}

export async function saveReminderPreferences(value: ReminderPreferences): Promise<void> {
  await setSetting("reminderPreferences", value);
}
