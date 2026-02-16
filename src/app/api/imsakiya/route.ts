import { NextRequest, NextResponse } from "next/server";

interface HijriLookupResponse {
  data?: {
    hijri?: {
      month?: { number?: number };
      year?: string;
    };
  };
}

interface HijriCalendarDay {
  timings: Record<string, string>;
  date: {
    hijri: {
      day: string;
      month: { number: number; ar: string };
      year: string;
    };
    gregorian: {
      date: string;
      weekday: { ar: string };
    };
  };
  meta?: {
    timezone?: string;
  };
}

interface HijriCalendarResponse {
  data?: HijriCalendarDay[];
}

function cleanTime(value: string): string {
  return value.split(" ")[0];
}

function toDdMmYyyy(date: Date): string {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = String(date.getFullYear());
  return `${dd}-${mm}-${yyyy}`;
}

async function resolveTargetHijriYear(explicitYear: number | null): Promise<number> {
  if (explicitYear) {
    return explicitYear;
  }

  const today = toDdMmYyyy(new Date());
  const response = await fetch(`https://api.aladhan.com/v1/gToH/${today}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Hijri lookup failed with ${response.status}`);
  }

  const payload = (await response.json()) as HijriLookupResponse;
  const hijriMonth = Number(payload.data?.hijri?.month?.number ?? 9);
  const hijriYear = Number(payload.data?.hijri?.year ?? "1447");

  if (!Number.isFinite(hijriYear)) {
    return 1447;
  }

  return hijriMonth <= 9 ? hijriYear : hijriYear + 1;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const lat = Number(request.nextUrl.searchParams.get("lat"));
  const lng = Number(request.nextUrl.searchParams.get("lng"));
  const method = Number(request.nextUrl.searchParams.get("method") ?? "4");
  const yearParam = request.nextUrl.searchParams.get("year");
  const parsedYear = yearParam ? Number(yearParam) : null;

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return NextResponse.json({ error: "Invalid query parameters" }, { status: 400 });
  }

  try {
    const targetHijriYear = await resolveTargetHijriYear(Number.isFinite(parsedYear) ? parsedYear : null);

    const params = new URLSearchParams({
      latitude: String(lat),
      longitude: String(lng),
      method: String(method),
    });

    const response = await fetch(
      `https://api.aladhan.com/v1/hijriCalendar/${targetHijriYear}/9?${params.toString()}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error(`Imsakiya request failed with ${response.status}`);
    }

    const payload = (await response.json()) as HijriCalendarResponse;
    const days = payload.data ?? [];

    return NextResponse.json({
      hijriYear: targetHijriYear,
      hijriMonth: "رمضان",
      timezone: days[0]?.meta?.timezone ?? "Asia/Riyadh",
      source: "AlAdhan API",
      days: days.map((day) => ({
        hijriDay: day.date.hijri.day,
        hijriLabel: `${day.date.hijri.day} ${day.date.hijri.month.ar} ${day.date.hijri.year}`,
        gregorianDate: day.date.gregorian.date,
        weekday: day.date.gregorian.weekday.ar,
        imsak: cleanTime(day.timings.Imsak),
        fajr: cleanTime(day.timings.Fajr),
        maghrib: cleanTime(day.timings.Maghrib),
        isha: cleanTime(day.timings.Isha),
      })),
    });
  } catch (error) {
    console.error("Imsakiya API error", error);
    return NextResponse.json({ error: "Failed to fetch imsakiya" }, { status: 502 });
  }
}
