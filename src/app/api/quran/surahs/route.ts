import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
  try {
    const response = await fetch("https://api.alquran.cloud/v1/surah", {
      next: { revalidate: 60 * 60 * 24 },
    });

    if (!response.ok) {
      throw new Error(`Surah list API failed with ${response.status}`);
    }

    const payload = (await response.json()) as {
      data?: {
        number: number;
        name: string;
        englishName: string;
        englishNameTranslation: string;
        numberOfAyahs: number;
      }[];
    };

    return NextResponse.json(payload.data ?? []);
  } catch (error) {
    console.error("Quran surah list route error", error);
    return NextResponse.json({ error: "Failed to fetch surah list" }, { status: 502 });
  }
}
