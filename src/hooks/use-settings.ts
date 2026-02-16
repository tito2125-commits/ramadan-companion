"use client";

import { useEffect, useState } from "react";
import { DEFAULT_PRAYER_METHOD, DEFAULT_REMINDER_PREFERENCES } from "@/core/constants";
import { ReminderPreferences } from "@/core/types";
import {
  getReminderPreferences,
  getSavedLocation,
  getSetting,
  saveLocation,
  saveReminderPreferences,
  setSetting,
} from "@/core/storage/client-db";

interface LocalSettingsState {
  prayerMethod: number;
  location: { lat: number; lng: number; label?: string } | null;
  reminders: ReminderPreferences;
  loading: boolean;
}

export function useSettings(): [
  LocalSettingsState,
  {
    setPrayerMethod: (value: number) => Promise<void>;
    setLocation: (value: { lat: number; lng: number; label?: string }) => Promise<void>;
    setReminders: (value: ReminderPreferences) => Promise<void>;
  }
] {
  const [state, setState] = useState<LocalSettingsState>({
    prayerMethod: DEFAULT_PRAYER_METHOD,
    location: null,
    reminders: DEFAULT_REMINDER_PREFERENCES,
    loading: true,
  });

  useEffect(() => {
    (async () => {
      const [prayerMethod, location, reminders] = await Promise.all([
        getSetting<number>("prayerMethod", DEFAULT_PRAYER_METHOD),
        getSavedLocation(),
        getReminderPreferences(),
      ]);

      setState({
        prayerMethod,
        location,
        reminders: reminders ?? DEFAULT_REMINDER_PREFERENCES,
        loading: false,
      });
    })();
  }, []);

  return [
    state,
    {
      setPrayerMethod: async (value) => {
        await setSetting("prayerMethod", value);
        setState((previous) => ({ ...previous, prayerMethod: value }));
      },
      setLocation: async (value) => {
        await saveLocation(value);
        setState((previous) => ({ ...previous, location: value }));
      },
      setReminders: async (value) => {
        await saveReminderPreferences(value);
        setState((previous) => ({ ...previous, reminders: value }));
      },
    },
  ];
}
