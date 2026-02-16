import { NextRequest, NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/prisma";
import { reminderPreferenceSchema } from "@/lib/validators";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const parsed = reminderPreferenceSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const prisma = getPrismaClient();
    const payload = parsed.data;

    await prisma.reminderPreference.upsert({
      where: { deviceId: payload.deviceId },
      create: {
        deviceId: payload.deviceId,
        wirdTime: payload.wirdTime,
        morningAthkarTime: payload.morningAthkarTime,
        eveningAthkarTime: payload.eveningAthkarTime,
        prePrayerMinutes: payload.prePrayerMinutes,
        enabledChannels: payload.enabledChannels,
        timezone: payload.timezone,
      },
      update: {
        wirdTime: payload.wirdTime,
        morningAthkarTime: payload.morningAthkarTime,
        eveningAthkarTime: payload.eveningAthkarTime,
        prePrayerMinutes: payload.prePrayerMinutes,
        enabledChannels: payload.enabledChannels,
        timezone: payload.timezone,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Reminder preferences error", error);
    return NextResponse.json({ error: "Saving preferences failed" }, { status: 500 });
  }
}
