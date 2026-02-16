import { NextRequest, NextResponse } from "next/server";

function cleanTime(value: string): string {
  return value.split(" ")[0];
}

function toAladhanDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  return `${day}-${month}-${year}`;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const lat = Number(request.nextUrl.searchParams.get("lat"));
  const lng = Number(request.nextUrl.searchParams.get("lng"));
  const date = request.nextUrl.searchParams.get("date");
  const method = Number(request.nextUrl.searchParams.get("method") ?? "4");

  if (!Number.isFinite(lat) || !Number.isFinite(lng) || !date) {
    return NextResponse.json({ error: "Invalid query parameters" }, { status: 400 });
  }

  try {
    const aladhanDate = toAladhanDate(date);
    const params = new URLSearchParams({
      latitude: String(lat),
      longitude: String(lng),
      method: String(method),
    });

    const response = await fetch(`https://api.aladhan.com/v1/timings/${aladhanDate}?${params.toString()}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`AlAdhan request failed with ${response.status}`);
    }

    const payload = (await response.json()) as {
      data?: {
        timings: Record<string, string>;
        meta: {
          timezone: string;
          method: { id: number };
        };
      };
    };

    if (!payload.data?.timings) {
      throw new Error("Missing timings payload");
    }

    return NextResponse.json({
      fajr: cleanTime(payload.data.timings.Fajr),
      sunrise: cleanTime(payload.data.timings.Sunrise),
      dhuhr: cleanTime(payload.data.timings.Dhuhr),
      asr: cleanTime(payload.data.timings.Asr),
      maghrib: cleanTime(payload.data.timings.Maghrib),
      isha: cleanTime(payload.data.timings.Isha),
      method: payload.data.meta.method.id,
      timezone: payload.data.meta.timezone,
      date,
      source: "AlAdhan API",
    });
  } catch (error) {
    console.error("Prayer times API error", error);
    return NextResponse.json({ error: "Failed to fetch prayer times" }, { status: 502 });
  }
}
