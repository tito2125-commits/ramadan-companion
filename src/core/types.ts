export type EnabledReminderChannel = "push" | "in-app";

export interface KhatmaPlan {
  id: string;
  startDate: string; // YYYY-MM-DD
  durationDays: 10 | 20 | 30;
  totalPages: number;
  pagesPerDay: number;
  currentPage: number;
  reminderTime: string; // HH:mm
}

export interface DailyWird {
  day: number;
  startPage: number;
  endPage: number;
  pagesCount: number;
}

export interface ReadingProgress {
  surah: number;
  ayah: number;
  page: number;
  updatedAt: string;
}

export interface Bookmark {
  id?: number;
  surah: number;
  ayah: number;
  note?: string;
  createdAt: string;
}

export interface PrayerTimes {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  method: number;
  timezone: string;
  date: string;
  source: string;
}

export interface CachedPrayerTimes {
  cacheKey: string;
  lat: number;
  lng: number;
  method: number;
  date: string;
  data: PrayerTimes;
  fetchedAt: string;
}

export interface QiblaState {
  bearingToKaaba: number;
  deviceHeading?: number;
  accuracy: "high" | "low";
  fallbackMode: "compass" | "map";
}

export type DhikrCategory = "morning" | "evening" | "after_prayer" | "sleep";

export interface DhikrItem {
  id: string;
  category: DhikrCategory;
  text: string;
  repeatTarget: number;
  sourceRef: string;
}

export interface LibraryItem {
  id: string;
  title: string;
  authority: string;
  url: string;
  tags: string[];
  verifiedAt: string;
  description: string;
}

export interface ReminderPreferences {
  wirdTime: string;
  morningAthkarTime: string;
  eveningAthkarTime: string;
  prePrayerMinutes: number;
  enabledChannels: EnabledReminderChannel[];
  timezone: string;
}

export interface QuranAyah {
  number: number;
  numberInSurah: number;
  juz: number;
  page: number;
  text: string;
}

export interface QuranSurah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
}

export interface QuranSurahPayload {
  surah: QuranSurah;
  ayahs: QuranAyah[];
  source: string;
  edition: string;
}

export interface PushSubscribePayload {
  deviceId: string;
  subscription: PushSubscriptionJSON;
}

export interface DeviceLocation {
  lat: number;
  lng: number;
  label?: string;
}
