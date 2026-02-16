"use client";

import { useEffect, useMemo, useState } from "react";
import { Clock3, LocateFixed } from "lucide-react";
import { SectionCard, SectionHeader } from "@/components/ui";
import { DEFAULT_PRAYER_METHOD } from "@/core/constants";
import { toISODate, upcomingPrayerName } from "@/core/date";
import { saveLocation, getSavedLocation, getSetting, setSetting } from "@/core/storage/client-db";
import { usePrayerTimes } from "@/hooks/use-prayer-times";

interface PositionState {
  lat: number;
  lng: number;
}

export default function PrayerPage(): React.JSX.Element {
  const [position, setPosition] = useState<PositionState | null>(null);
  const [method, setMethod] = useState<number>(DEFAULT_PRAYER_METHOD);
  const [manualLat, setManualLat] = useState(24.7136);
  const [manualLng, setManualLng] = useState(46.6753);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const [savedLocation, savedMethod] = await Promise.all([
        getSavedLocation(),
        getSetting<number>("prayerMethod", DEFAULT_PRAYER_METHOD),
      ]);

      if (savedLocation) {
        setPosition({ lat: savedLocation.lat, lng: savedLocation.lng });
        setManualLat(savedLocation.lat);
        setManualLng(savedLocation.lng);
      }

      setMethod(savedMethod);
    })();
  }, []);

  const prayer = usePrayerTimes(position ? { lat: position.lat, lng: position.lng, method } : null);

  const nextPrayer = useMemo(() => {
    if (!prayer.data) {
      return null;
    }

    return upcomingPrayerName(prayer.data);
  }, [prayer.data]);

  const detectLocation = (): void => {
    if (!navigator.geolocation) {
      setMessage("المتصفح لا يدعم تحديد الموقع.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (location) => {
        const point = {
          lat: Number(location.coords.latitude.toFixed(4)),
          lng: Number(location.coords.longitude.toFixed(4)),
          label: "الموقع الحالي",
        };
        setPosition(point);
        setManualLat(point.lat);
        setManualLng(point.lng);
        await saveLocation(point);
        setMessage("تم استخدام موقعك الحالي.");
      },
      () => setMessage("تعذر الوصول للموقع، أدخل الإحداثيات يدويًا."),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const applyManualLocation = async (): Promise<void> => {
    const point = {
      lat: Number(manualLat),
      lng: Number(manualLng),
      label: "يدوي",
    };
    setPosition(point);
    await saveLocation(point);
    setMessage("تم حفظ الموقع اليدوي.");
  };

  const onSaveMethod = async (value: number): Promise<void> => {
    setMethod(value);
    await setSetting("prayerMethod", value);
    setMessage("تم تحديث طريقة الحساب.");
  };

  return (
    <>
      <SectionCard>
        <SectionHeader
          title="مواقيت الصلاة"
          subtitle={`مواقيت اليوم (${toISODate()}) حسب موقعك وطريقة الحساب المختارة.`}
          icon={LocateFixed}
        />

        <div className="form-grid">
          <div className="inline-actions">
            <button onClick={detectLocation}>تحديد موقعي تلقائيًا</button>
            <button className="secondary" onClick={() => void prayer.refresh()}>
              تحديث المواقيت
            </button>
          </div>

          <div className="grid-cards">
            <div className="form-row">
              <label htmlFor="manualLat">خط العرض</label>
              <input
                id="manualLat"
                type="number"
                step="0.0001"
                value={manualLat}
                onChange={(event) => setManualLat(Number(event.target.value))}
              />
            </div>
            <div className="form-row">
              <label htmlFor="manualLng">خط الطول</label>
              <input
                id="manualLng"
                type="number"
                step="0.0001"
                value={manualLng}
                onChange={(event) => setManualLng(Number(event.target.value))}
              />
            </div>
          </div>

          <div className="inline-actions">
            <button className="secondary" onClick={() => void applyManualLocation()}>
              استخدام الإحداثيات اليدوية
            </button>
          </div>

          <div className="form-row">
            <label htmlFor="method">طريقة الحساب</label>
            <select id="method" value={method} onChange={(event) => void onSaveMethod(Number(event.target.value))}>
              <option value={4}>أم القرى (افتراضي)</option>
              <option value={3}>رابطة العالم الإسلامي</option>
              <option value={2}>الجامعة الإسلامية - كراتشي</option>
              <option value={5}>الهيئة المصرية العامة</option>
            </select>
          </div>
        </div>

        {message ? <p className="success">{message}</p> : null}
      </SectionCard>

      <SectionCard>
        <SectionHeader title="الصلاة القادمة" icon={Clock3} />
        {prayer.loading ? <p className="muted">جارٍ تحميل المواقيت...</p> : null}
        {prayer.error ? <p className="error">{prayer.error}</p> : null}
        {prayer.fromCache ? <p className="muted">تم عرض آخر نسخة محفوظة أوفلاين.</p> : null}
        {nextPrayer ? (
          <div className="metric">
            <p>الوقت القادم</p>
            <strong>
              {nextPrayer.name} - {nextPrayer.time}
            </strong>
          </div>
        ) : null}

        {prayer.data ? (
          <div className="grid-cards">
            <div className="list-item">الفجر: {prayer.data.fajr}</div>
            <div className="list-item">الشروق: {prayer.data.sunrise}</div>
            <div className="list-item">الظهر: {prayer.data.dhuhr}</div>
            <div className="list-item">العصر: {prayer.data.asr}</div>
            <div className="list-item">المغرب: {prayer.data.maghrib}</div>
            <div className="list-item">العشاء: {prayer.data.isha}</div>
          </div>
        ) : null}
      </SectionCard>
    </>
  );
}
