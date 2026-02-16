"use client";

import { LibraryItem, PrayerTimes, QuranSurah, QuranSurahPayload } from "@/core/types";

export async function fetchPrayerTimes(params: {
  lat: number;
  lng: number;
  date: string;
  method: number;
}): Promise<PrayerTimes> {
  const query = new URLSearchParams({
    lat: String(params.lat),
    lng: String(params.lng),
    date: params.date,
    method: String(params.method),
  });

  const response = await fetch(`/api/prayer-times?${query.toString()}`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error("تعذر تحميل مواقيت الصلاة");
  }

  return response.json();
}

export async function fetchSurahList(): Promise<QuranSurah[]> {
  const response = await fetch("/api/quran/surahs", { cache: "no-store" });
  if (!response.ok) {
    throw new Error("تعذر تحميل قائمة السور");
  }
  return response.json();
}

export async function fetchSurah(surahNumber: number): Promise<QuranSurahPayload> {
  const response = await fetch(`/api/quran/surah/${surahNumber}`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error("تعذر تحميل السورة");
  }
  return response.json();
}

export async function fetchLibraryItems(): Promise<LibraryItem[]> {
  const response = await fetch("/api/library", { cache: "no-store" });
  if (!response.ok) {
    throw new Error("تعذر تحميل المكتبة");
  }
  return response.json();
}
