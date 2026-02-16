import { NextRequest, NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/prisma";
import { sendPushNotification } from "@/lib/push";

function nowInTimezone(timezone: string): string {
  const parts = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: timezone,
  }).formatToParts(new Date());

  const hour = parts.find((part) => part.type === "hour")?.value ?? "00";
  const minute = parts.find((part) => part.type === "minute")?.value ?? "00";
  return `${hour}:${minute}`;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const secret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");
  if (secret && authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const prisma = getPrismaClient();
    const records = await prisma.pushSubscription.findMany({
      include: { reminderPreference: true },
    });

    let sent = 0;
    for (const item of records) {
      const prefs = item.reminderPreference;
      if (!prefs || !prefs.enabledChannels.includes("push")) {
        continue;
      }

      const current = nowInTimezone(prefs.timezone);
      let body: string | null = null;

      if (current === prefs.wirdTime) {
        body = "حان وقت وردك اليومي من القرآن.";
      } else if (current === prefs.morningAthkarTime) {
        body = "تذكير أذكار الصباح.";
      } else if (current === prefs.eveningAthkarTime) {
        body = "تذكير أذكار المساء.";
      }

      if (!body) {
        continue;
      }

      try {
        await sendPushNotification(item.subscriptionJson as never, {
          title: "رفيق رمضان",
          body,
          url: "/",
        });
        sent += 1;
      } catch (error) {
        console.error("Failed push send", error);
      }
    }

    return NextResponse.json({ ok: true, sent });
  } catch (error) {
    console.error("Cron push failed", error);
    return NextResponse.json({ error: "Cron push failed" }, { status: 500 });
  }
}
