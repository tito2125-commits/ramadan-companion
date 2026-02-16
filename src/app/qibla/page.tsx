"use client";

import { useEffect, useMemo, useState } from "react";
import { Compass, MapPinned, Radar } from "lucide-react";
import { SectionCard, SectionHeader } from "@/components/ui";
import { KAABA_COORDS } from "@/core/constants";
import { getQiblaBearing, relativeNeedleRotation } from "@/core/qibla";
import { getSavedLocation, saveLocation } from "@/core/storage/client-db";

export default function QiblaPage(): React.JSX.Element {
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [heading, setHeading] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const location = await getSavedLocation();
      if (location) {
        setLat(location.lat);
        setLng(location.lng);
      }
    })();
  }, []);

  const bearing = useMemo(() => {
    if (lat === null || lng === null) {
      return null;
    }
    return getQiblaBearing(lat, lng);
  }, [lat, lng]);

  useEffect(() => {
    const listener = (event: DeviceOrientationEvent): void => {
      if (typeof event.alpha === "number") {
        setHeading(event.alpha);
      }
    };

    window.addEventListener("deviceorientation", listener, true);
    return () => window.removeEventListener("deviceorientation", listener, true);
  }, []);

  const requestCompassPermission = async (): Promise<void> => {
    try {
      const DeviceOrientationEventWithPermission = DeviceOrientationEvent as typeof DeviceOrientationEvent & {
        requestPermission?: () => Promise<"granted" | "denied">;
      };

      if (typeof DeviceOrientationEventWithPermission.requestPermission === "function") {
        const state = await DeviceOrientationEventWithPermission.requestPermission();
        if (state === "granted") {
          setMessage("تم تفعيل البوصلة.");
        } else {
          setMessage("لم يتم منح صلاحية البوصلة.");
        }
      } else {
        setMessage("البوصلة مفعلة تلقائيًا إذا كانت مدعومة.");
      }
    } catch {
      setMessage("تعذر تفعيل البوصلة على هذا الجهاز.");
    }
  };

  const detectLocation = (): void => {
    if (!navigator.geolocation) {
      setMessage("المتصفح لا يدعم تحديد الموقع.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const nextLat = Number(position.coords.latitude.toFixed(4));
        const nextLng = Number(position.coords.longitude.toFixed(4));
        setLat(nextLat);
        setLng(nextLng);
        await saveLocation({ lat: nextLat, lng: nextLng, label: "الموقع الحالي" });
        setMessage("تم تحديث الموقع لحساب اتجاه القبلة.");
      },
      () => setMessage("تعذر الحصول على الموقع."),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const rotation = bearing !== null && heading !== null ? relativeNeedleRotation(bearing, heading) : null;

  return (
    <>
      <SectionCard>
        <SectionHeader
          title="اتجاه القبلة"
          subtitle="بوصلة حية عند الدعم، مع خريطة بديلة دائمًا."
          icon={Compass}
        />
        <div className="inline-actions">
          <button onClick={() => void requestCompassPermission()}>تفعيل البوصلة</button>
          <button className="secondary" onClick={detectLocation}>
            تحديث الموقع
          </button>
        </div>
        {message ? <p className="muted">{message}</p> : null}
      </SectionCard>

      <SectionCard>
        <SectionHeader title="مؤشر الاتجاه" icon={Radar} />
        {!bearing ? <p className="muted">حدّد الموقع أولًا.</p> : null}

        {bearing ? (
          <div className="form-grid">
            <p>
              الاتجاه إلى الكعبة: <strong>{bearing.toFixed(1)}°</strong>
            </p>
            <p className="muted">
              اتجاه الجهاز: {heading ? `${heading.toFixed(1)}°` : "غير متوفر"} - الوضع:{" "}
              {rotation === null ? "خريطة" : "بوصلة"}
            </p>

            <div
              style={{
                width: "200px",
                height: "200px",
                borderRadius: "50%",
                border: "1px solid var(--border)",
                margin: "0 auto",
                position: "relative",
                background: "#fff",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  width: "2px",
                  height: "75px",
                  background: "var(--primary)",
                  transformOrigin: "top",
                  transform: `translate(-50%, -5%) rotate(${rotation ?? bearing}deg)`,
                  transition: "transform 200ms linear",
                }}
              />
            </div>
          </div>
        ) : null}
      </SectionCard>

      <SectionCard>
        <SectionHeader title="الخريطة البديلة" icon={MapPinned} />
        {lat !== null && lng !== null ? (
          <a
            className="list-item"
            href={`https://www.google.com/maps/dir/${lat},${lng}/${KAABA_COORDS.lat},${KAABA_COORDS.lng}`}
            target="_blank"
            rel="noreferrer"
          >
            افتح الاتجاه إلى الكعبة عبر الخريطة
          </a>
        ) : (
          <p className="muted">بعد تحديد موقعك، يظهر رابط الخريطة هنا.</p>
        )}
        <p className="muted">إذا كانت البوصلة غير دقيقة، أعد معايرة الجهاز بحركة 8 ثم استخدم الخريطة للتحقق.</p>
      </SectionCard>
    </>
  );
}
