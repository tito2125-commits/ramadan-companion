"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, LocateFixed } from "lucide-react";
import { SectionCard, SectionHeader } from "@/components/ui";
import { DEFAULT_PRAYER_METHOD } from "@/core/constants";
import { getSavedLocation, getSetting, saveLocation, setSetting } from "@/core/storage/client-db";

interface ImsakiyaDay {
  hijriDay: string;
  hijriLabel: string;
  gregorianDate: string;
  weekday: string;
  imsak: string;
  fajr: string;
  maghrib: string;
  isha: string;
}

interface ImsakiyaPayload {
  hijriYear: number;
  hijriMonth: string;
  timezone: string;
  source: string;
  days: ImsakiyaDay[];
}

function todayAsDdMmYyyy(): string {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, "0");
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const yyyy = String(now.getFullYear());
  return `${dd}-${mm}-${yyyy}`;
}

export default function ImsakiyaPage(): React.JSX.Element {
  const [manualLat, setManualLat] = useState(24.7136);
  const [manualLng, setManualLng] = useState(46.6753);
  const [method, setMethod] = useState(DEFAULT_PRAYER_METHOD);
  const [hijriYear, setHijriYear] = useState<number | "">("");
  const [data, setData] = useState<ImsakiyaPayload | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const [savedLocation, savedMethod] = await Promise.all([
        getSavedLocation(),
        getSetting<number>("prayerMethod", DEFAULT_PRAYER_METHOD),
      ]);

      if (savedLocation) {
        setManualLat(savedLocation.lat);
        setManualLng(savedLocation.lng);
      }
      setMethod(savedMethod);
    })();
  }, []);

  const loadImsakiya = async (params?: { lat?: number; lng?: number; year?: number | "" }): Promise<void> => {
    const lat = params?.lat ?? manualLat;
    const lng = params?.lng ?? manualLng;
    const year = params?.year ?? hijriYear;

    const query = new URLSearchParams({
      lat: String(lat),
      lng: String(lng),
      method: String(method),
    });

    if (year && Number.isFinite(Number(year))) {
      query.set("year", String(year));
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/imsakiya?${query.toString()}`, { cache: "no-store" });
      if (!response.ok) {
        throw new Error("تعذر جلب الإمساكية.");
      }

      const payload = (await response.json()) as ImsakiyaPayload;
      setData(payload);
      if (hijriYear === "") {
        setHijriYear(payload.hijriYear);
      }
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "تعذر جلب الإمساكية.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadImsakiya();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [method]);

  const detectLocation = (): void => {
    if (!navigator.geolocation) {
      setMessage("المتصفح لا يدعم تحديد الموقع.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const point = {
          lat: Number(position.coords.latitude.toFixed(4)),
          lng: Number(position.coords.longitude.toFixed(4)),
          label: "الموقع الحالي",
        };
        setManualLat(point.lat);
        setManualLng(point.lng);
        await saveLocation(point);
        setMessage("تم تحديث الموقع.");
        await loadImsakiya({ lat: point.lat, lng: point.lng });
      },
      () => setMessage("تعذر الوصول للموقع، استخدم الإحداثيات اليدوية."),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const applyManualLocation = async (): Promise<void> => {
    const point = {
      lat: Number(manualLat),
      lng: Number(manualLng),
      label: "يدوي",
    };
    await saveLocation(point);
    setMessage("تم حفظ الإحداثيات اليدوية.");
    await loadImsakiya({ lat: point.lat, lng: point.lng });
  };

  const saveMethod = async (nextMethod: number): Promise<void> => {
    setMethod(nextMethod);
    await setSetting("prayerMethod", nextMethod);
  };

  const today = todayAsDdMmYyyy();

  const days = useMemo(() => data?.days ?? [], [data]);

  return (
    <>
      <SectionCard>
        <SectionHeader
          title="إمساكية رمضان"
          subtitle="جدول يومي للصيام والصلاة حسب موقعك وطريقة الحساب."
          icon={CalendarDays}
        />

        <div className="form-grid">
          <div className="inline-actions">
            <button onClick={detectLocation}>
              <LocateFixed size={18} strokeWidth={2} /> تحديد موقعي
            </button>
            <button className="secondary" onClick={() => void loadImsakiya()}>
              تحديث الإمساكية
            </button>
          </div>

          <div className="grid-cards">
            <div className="form-row">
              <label htmlFor="imsakiyaLat">خط العرض</label>
              <input
                id="imsakiyaLat"
                type="number"
                step="0.0001"
                value={manualLat}
                onChange={(event) => setManualLat(Number(event.target.value))}
              />
            </div>
            <div className="form-row">
              <label htmlFor="imsakiyaLng">خط الطول</label>
              <input
                id="imsakiyaLng"
                type="number"
                step="0.0001"
                value={manualLng}
                onChange={(event) => setManualLng(Number(event.target.value))}
              />
            </div>
          </div>

          <div className="grid-cards">
            <div className="form-row">
              <label htmlFor="imsakiyaMethod">طريقة الحساب</label>
              <select
                id="imsakiyaMethod"
                value={method}
                onChange={(event) => void saveMethod(Number(event.target.value))}
              >
                <option value={4}>أم القرى (افتراضي)</option>
                <option value={3}>رابطة العالم الإسلامي</option>
                <option value={2}>الجامعة الإسلامية - كراتشي</option>
                <option value={5}>الهيئة المصرية العامة</option>
              </select>
            </div>
            <div className="form-row">
              <label htmlFor="hijriYear">السنة الهجرية</label>
              <input
                id="hijriYear"
                type="number"
                min={1400}
                max={1600}
                value={hijriYear}
                onChange={(event) => setHijriYear(Number(event.target.value) || "")}
              />
            </div>
          </div>

          <div className="inline-actions">
            <button className="secondary" onClick={() => void applyManualLocation()}>
              استخدام الإحداثيات اليدوية
            </button>
            <button className="secondary" onClick={() => void loadImsakiya({ year: hijriYear })}>
              تطبيق السنة
            </button>
          </div>
        </div>

        {message ? <p className="success">{message}</p> : null}
        {error ? <p className="error">{error}</p> : null}
      </SectionCard>

      <SectionCard>
        <SectionHeader
          title={data ? `إمساكية ${data.hijriMonth} ${data.hijriYear}` : "الجدول اليومي"}
          subtitle={data ? `المنطقة الزمنية: ${data.timezone}` : ""}
          icon={CalendarDays}
        />

        {loading ? <p className="muted">جارٍ تحميل الإمساكية...</p> : null}

        <div className="imsakiya-list">
          {days.map((day) => {
            const isToday = day.gregorianDate === today;
            return (
              <article className={isToday ? "imsakiya-row today" : "imsakiya-row"} key={`${day.hijriDay}-${day.gregorianDate}`}>
                <div className="imsakiya-row-head">
                  <h3>اليوم {day.hijriDay}</h3>
                  <p>
                    {day.weekday} | {day.gregorianDate}
                  </p>
                </div>

                <div className="imsakiya-times">
                  <div>
                    <span>الإمساك</span>
                    <strong>{day.imsak}</strong>
                  </div>
                  <div>
                    <span>الفجر</span>
                    <strong>{day.fajr}</strong>
                  </div>
                  <div>
                    <span>المغرب</span>
                    <strong>{day.maghrib}</strong>
                  </div>
                  <div>
                    <span>العشاء</span>
                    <strong>{day.isha}</strong>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </SectionCard>
    </>
  );
}
