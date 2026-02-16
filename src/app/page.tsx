"use client";

import { useEffect, useMemo, useState } from "react";
import { BellRing, LayoutDashboard } from "lucide-react";
import { InAppAlert, SectionCard, SectionHeader } from "@/components/ui";
import { ATHKAR_DATA } from "@/data/athkar";
import { DEFAULT_PRAYER_METHOD, DEFAULT_REMINDER_PREFERENCES } from "@/core/constants";
import { getTodayWird, pageToJuz, progressPercent } from "@/core/khatma";
import { upcomingPrayerName } from "@/core/date";
import { useInAppReminders } from "@/hooks/use-in-app-reminders";
import { usePrayerTimes } from "@/hooks/use-prayer-times";
import {
  getPrimaryKhatmaPlan,
  getReminderPreferences,
  getSavedLocation,
  getSetting,
} from "@/core/storage/client-db";
import { KhatmaPlan, ReminderPreferences } from "@/core/types";

export default function HomePage(): React.JSX.Element {
  const [plan, setPlan] = useState<KhatmaPlan | null>(null);
  const [reminders, setReminders] = useState<ReminderPreferences | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [method, setMethod] = useState(DEFAULT_PRAYER_METHOD);

  useEffect(() => {
    (async () => {
      const [savedPlan, savedReminders, savedLocation, savedMethod] = await Promise.all([
        getPrimaryKhatmaPlan(),
        getReminderPreferences(),
        getSavedLocation(),
        getSetting<number>("prayerMethod", DEFAULT_PRAYER_METHOD),
      ]);
      setPlan(savedPlan);
      setReminders(savedReminders ?? DEFAULT_REMINDER_PREFERENCES);
      if (savedLocation) {
        setLocation({ lat: savedLocation.lat, lng: savedLocation.lng });
      }
      setMethod(savedMethod);
    })();
  }, []);

  const prayer = usePrayerTimes(location ? { lat: location.lat, lng: location.lng, method } : null);

  const todayWird = useMemo(() => (plan ? getTodayWird(plan) : null), [plan]);
  const randomDhikr = useMemo(
    () => ATHKAR_DATA[Math.floor(new Date().getDate() % ATHKAR_DATA.length)],
    []
  );
  const nextPrayer = useMemo(() => (prayer.data ? upcomingPrayerName(prayer.data) : null), [prayer.data]);

  const alerts = useInAppReminders(reminders, prayer.data);

  return (
    <>
      <SectionCard>
        <SectionHeader title="لوحة اليوم" subtitle="ملخص سريع لعباداتك اليومية في رمضان." icon={LayoutDashboard} />

        <div className="grid-cards">
          <div className="metric">
            <p>ورد اليوم</p>
            <strong>
              {todayWird ? `${todayWird.startPage} - ${todayWird.endPage}` : "لم تبدأ خطة"}
            </strong>
            <p>{todayWird ? `${todayWird.pagesCount} صفحة` : "اختر خطة ختمة من صفحة الختمة"}</p>
          </div>

          <div className="metric">
            <p>الصلاة القادمة</p>
            <strong>{nextPrayer ? nextPrayer.name : "غير متاحة"}</strong>
            <p>{nextPrayer ? nextPrayer.time : "فعّل الموقع من صفحة الصلاة"}</p>
          </div>

          <div className="metric">
            <p>التقدم الحالي</p>
            <strong>{plan ? `${progressPercent(plan.currentPage)}%` : "0%"}</strong>
            <p>{plan ? `حتى الصفحة ${plan.currentPage} (جزء ${pageToJuz(plan.currentPage)})` : "لا يوجد تقدم محفوظ"}</p>
          </div>

          <div className="metric">
            <p>ذكر اليوم</p>
            <strong>{randomDhikr.repeatTarget}x</strong>
            <p>{randomDhikr.text}</p>
          </div>
        </div>
      </SectionCard>

      <SectionCard>
        <SectionHeader
          title="تنبيهات داخل التطبيق"
          subtitle="تعمل حتى بدون الإشعارات الفورية عندما يكون التطبيق مفتوحًا."
          icon={BellRing}
        />
        <div className="list">
          {alerts.length === 0 ? <p className="muted">لا يوجد تنبيه الآن.</p> : null}
          {alerts.map((alert) => (
            <InAppAlert key={alert.id} text={alert.text} />
          ))}
        </div>
      </SectionCard>
    </>
  );
}
