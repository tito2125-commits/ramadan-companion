"use client";

import { useEffect, useRef, useState } from "react";
import { PrayerTimes, ReminderPreferences } from "@/core/types";
import { isTimeMatch } from "@/core/reminders";

interface ReminderMessage {
  id: string;
  text: string;
}

function minutesFromTime(value: string): number {
  const [hour, minute] = value.split(":").map(Number);
  return hour * 60 + minute;
}

type PrayerKey = "fajr" | "dhuhr" | "asr" | "maghrib" | "isha";

const PRAYER_ORDER: Array<{ key: PrayerKey; label: string }> = [
  { key: "fajr", label: "الفجر" },
  { key: "dhuhr", label: "الظهر" },
  { key: "asr", label: "العصر" },
  { key: "maghrib", label: "المغرب" },
  { key: "isha", label: "العشاء" },
];

export function useInAppReminders(
  prefs: ReminderPreferences | null,
  prayerTimes?: Pick<PrayerTimes, "fajr" | "dhuhr" | "asr" | "maghrib" | "isha"> | null
): ReminderMessage[] {
  const [messages, setMessages] = useState<ReminderMessage[]>([]);
  const signatures = useRef(new Set<string>());

  useEffect(() => {
    if (!prefs || !prefs.enabledChannels.includes("in-app")) {
      return;
    }

    const tick = (): void => {
      const now = new Date();
      const keyPrefix = `${now.toDateString()}-${now.getHours()}-${now.getMinutes()}`;
      const next: ReminderMessage[] = [];

      if (isTimeMatch(prefs.wirdTime, now)) {
        const id = `${keyPrefix}-wird`;
        if (!signatures.current.has(id)) {
          signatures.current.add(id);
          next.push({ id, text: "تذكير: حان وقت وردك اليومي." });
        }
      }

      if (isTimeMatch(prefs.morningAthkarTime, now)) {
        const id = `${keyPrefix}-morning`;
        if (!signatures.current.has(id)) {
          signatures.current.add(id);
          next.push({ id, text: "تذكير: أذكار الصباح." });
        }
      }

      if (isTimeMatch(prefs.eveningAthkarTime, now)) {
        const id = `${keyPrefix}-evening`;
        if (!signatures.current.has(id)) {
          signatures.current.add(id);
          next.push({ id, text: "تذكير: أذكار المساء." });
        }
      }

      if (prayerTimes) {
        const currentMinutes = now.getHours() * 60 + now.getMinutes();
        const leadTime = Math.max(0, Math.min(60, prefs.prePrayerMinutes));

        for (const prayer of PRAYER_ORDER) {
          const prayerMinutes = minutesFromTime(prayerTimes[prayer.key]);
          const triggerAt = prayerMinutes - leadTime;
          if (triggerAt < 0) {
            continue;
          }

          if (currentMinutes === triggerAt) {
            const id = `${keyPrefix}-pre-${prayer.key}`;
            if (!signatures.current.has(id)) {
              signatures.current.add(id);
              next.push({
                id,
                text: `تذكير: متبقٍ ${leadTime} دقيقة على صلاة ${prayer.label}.`,
              });
            }
          }
        }
      }

      if (next.length > 0) {
        setMessages((previous) => [...next, ...previous].slice(0, 3));
      }
    };

    tick();
    const interval = setInterval(tick, 30_000);
    return () => clearInterval(interval);
  }, [prefs, prayerTimes, signatures]);

  return messages;
}
