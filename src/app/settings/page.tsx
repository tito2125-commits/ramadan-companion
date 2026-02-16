"use client";

import { useEffect, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { SectionCard, SectionHeader } from "@/components/ui";
import { DEFAULT_REMINDER_PREFERENCES } from "@/core/constants";
import { getDeviceId, subscribeToPush, unsubscribeFromPush } from "@/core/push-client";
import { normalizeReminderPreferences } from "@/core/reminders";
import { saveReminderPreferences, getReminderPreferences } from "@/core/storage/client-db";
import { ReminderPreferences } from "@/core/types";

export default function SettingsPage(): React.JSX.Element {
  const [prefs, setPrefs] = useState<ReminderPreferences>(DEFAULT_REMINDER_PREFERENCES);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const stored = await getReminderPreferences();
      if (stored) {
        setPrefs(stored);
      }
    })();
  }, []);

  const savePrefs = async (): Promise<void> => {
    const normalized = normalizeReminderPreferences(prefs);
    setPrefs(normalized);
    await saveReminderPreferences(normalized);

    await fetch("/api/push/reminder-preferences", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...normalized,
        deviceId: getDeviceId(),
      }),
    });

    setStatus("تم حفظ إعدادات التذكير.");
  };

  const toggleChannel = (channel: "push" | "in-app"): void => {
    const has = prefs.enabledChannels.includes(channel);
    const next = has ? prefs.enabledChannels.filter((item) => item !== channel) : [...prefs.enabledChannels, channel];
    setPrefs({ ...prefs, enabledChannels: next.length === 0 ? ["in-app"] : next });
  };

  const onSubscribePush = async (): Promise<void> => {
    const ok = await subscribeToPush();
    setStatus(ok ? "تم تفعيل الإشعارات الفورية." : "تعذر تفعيل الإشعارات الفورية. تحقق من الأذونات والمفاتيح.");
  };

  const onUnsubscribePush = async (): Promise<void> => {
    const ok = await unsubscribeFromPush();
    setStatus(ok ? "تم إيقاف الإشعارات الفورية." : "تعذر إيقاف الإشعارات الفورية.");
  };

  const onTestPush = async (): Promise<void> => {
    const response = await fetch("/api/push/test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deviceId: getDeviceId() }),
    });

    setStatus(response.ok ? "تم إرسال إشعار تجريبي." : "تعذر إرسال الإشعار التجريبي.");
  };

  return (
    <SectionCard>
      <SectionHeader
        title="الإعدادات والتنبيهات"
        subtitle="إدارة أوقات التذكير وقنوات التنبيه."
        icon={SlidersHorizontal}
      />

      <div className="form-grid">
        <div className="form-row">
          <label htmlFor="wirdTime">تذكير الورد</label>
          <input
            id="wirdTime"
            type="time"
            value={prefs.wirdTime}
            onChange={(event) => setPrefs({ ...prefs, wirdTime: event.target.value })}
          />
        </div>

        <div className="form-row">
          <label htmlFor="morningTime">أذكار الصباح</label>
          <input
            id="morningTime"
            type="time"
            value={prefs.morningAthkarTime}
            onChange={(event) => setPrefs({ ...prefs, morningAthkarTime: event.target.value })}
          />
        </div>

        <div className="form-row">
          <label htmlFor="eveningTime">أذكار المساء</label>
          <input
            id="eveningTime"
            type="time"
            value={prefs.eveningAthkarTime}
            onChange={(event) => setPrefs({ ...prefs, eveningAthkarTime: event.target.value })}
          />
        </div>

        <div className="form-row">
          <label htmlFor="prePrayerMinutes">قبل الصلاة (دقائق)</label>
          <input
            id="prePrayerMinutes"
            type="number"
            min={0}
            max={60}
            value={prefs.prePrayerMinutes}
            onChange={(event) => setPrefs({ ...prefs, prePrayerMinutes: Number(event.target.value) })}
          />
        </div>

        <div className="form-row">
          <label>قنوات التذكير</label>
          <div className="inline-actions">
            <button
              className={prefs.enabledChannels.includes("in-app") ? "" : "secondary"}
              onClick={() => toggleChannel("in-app")}
            >
              داخل التطبيق
            </button>
            <button
              className={prefs.enabledChannels.includes("push") ? "" : "secondary"}
              onClick={() => toggleChannel("push")}
            >
              إشعارات فورية
            </button>
          </div>
        </div>

        <div className="inline-actions">
          <button onClick={() => void savePrefs()}>حفظ الإعدادات</button>
          <button className="secondary" onClick={() => void onSubscribePush()}>
            تفعيل الإشعارات الفورية
          </button>
          <button className="secondary" onClick={() => void onUnsubscribePush()}>
            إيقاف الإشعارات الفورية
          </button>
          <button className="warn" onClick={() => void onTestPush()}>
            تنبيه تجريبي
          </button>
        </div>
      </div>

      {status ? <p className="muted">{status}</p> : null}
    </SectionCard>
  );
}
