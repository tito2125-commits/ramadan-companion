import { NextRequest, NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/prisma";
import { sendPushNotification } from "@/lib/push";
import { unsubscribePayloadSchema } from "@/lib/validators";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const parsed = unsubscribePayloadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const prisma = getPrismaClient();

    const record = await prisma.pushSubscription.findUnique({
      where: { deviceId: parsed.data.deviceId },
    });

    if (!record) {
      return NextResponse.json({ error: "No subscription found" }, { status: 404 });
    }

    await sendPushNotification(record.subscriptionJson as never, {
      title: "رفيق رمضان",
      body: "هذا تنبيه تجريبي من التطبيق.",
      url: "/",
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Push test error", error);
    return NextResponse.json({ error: "Failed to send test notification" }, { status: 500 });
  }
}
