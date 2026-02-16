"use client";

import { useEffect, useState } from "react";
import { fetchPrayerTimes } from "@/core/api/client";
import { toISODate } from "@/core/date";
import { PrayerTimes } from "@/core/types";
import { getPrayerCache, savePrayerCache } from "@/core/storage/client-db";

interface UsePrayerTimesArgs {
  lat: number;
  lng: number;
  method: number;
}

interface UsePrayerTimesResult {
  data: PrayerTimes | null;
  loading: boolean;
  error: string | null;
  fromCache: boolean;
  refresh: () => Promise<void>;
}

export function usePrayerTimes(args: UsePrayerTimesArgs | null): UsePrayerTimesResult {
  const [data, setData] = useState<PrayerTimes | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fromCache, setFromCache] = useState(false);

  const run = async (): Promise<void> => {
    if (!args) {
      setData(null);
      return;
    }

    const date = toISODate();
    const cacheKey = `${args.lat.toFixed(3)}:${args.lng.toFixed(3)}:${args.method}:${date}`;

    setLoading(true);
    setError(null);

    try {
      const payload = await fetchPrayerTimes({
        lat: args.lat,
        lng: args.lng,
        date,
        method: args.method,
      });

      setData(payload);
      setFromCache(false);

      await savePrayerCache({
        cacheKey,
        lat: args.lat,
        lng: args.lng,
        method: args.method,
        date,
        data: payload,
        fetchedAt: new Date().toISOString(),
      });
    } catch (networkError) {
      const cached = await getPrayerCache(cacheKey);
      if (cached) {
        setData(cached.data);
        setFromCache(true);
      } else {
        setError(networkError instanceof Error ? networkError.message : "تعذر تحميل المواقيت");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [args?.lat, args?.lng, args?.method]);

  return { data, loading, error, fromCache, refresh: run };
}
