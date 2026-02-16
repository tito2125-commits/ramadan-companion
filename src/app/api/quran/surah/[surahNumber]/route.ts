import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ surahNumber: string }> }
): Promise<NextResponse> {
  const { surahNumber } = await params;
  const surah = Number(surahNumber);

  if (!Number.isInteger(surah) || surah < 1 || surah > 114) {
    return NextResponse.json({ error: "Invalid surah number" }, { status: 400 });
  }

  try {
    const response = await fetch(`https://api.alquran.cloud/v1/surah/${surah}/ar.quran-uthmani`, {
      next: { revalidate: 60 * 60 * 24 },
    });

    if (!response.ok) {
      throw new Error(`Quran API failed with ${response.status}`);
    }

    const payload = (await response.json()) as {
      data?: {
        number: number;
        name: string;
        englishName: string;
        englishNameTranslation: string;
        numberOfAyahs: number;
        ayahs: {
          number: number;
          numberInSurah: number;
          juz: number;
          page: number;
          text: string;
        }[];
      };
    };

    if (!payload.data) {
      throw new Error("Missing Quran payload");
    }

    return NextResponse.json({
      surah: {
        number: payload.data.number,
        name: payload.data.name,
        englishName: payload.data.englishName,
        englishNameTranslation: payload.data.englishNameTranslation,
        numberOfAyahs: payload.data.numberOfAyahs,
      },
      ayahs: payload.data.ayahs,
      source: "AlQuran Cloud",
      edition: "ar.quran-uthmani",
    });
  } catch (error) {
    console.error("Quran surah route error", error);
    return NextResponse.json({ error: "Failed to fetch surah" }, { status: 502 });
  }
}
