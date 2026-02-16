import { NextRequest, NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/prisma";
import { pushSubscribePayloadSchema } from "@/lib/validators";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const parsed = pushSubscribePayloadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const prisma = getPrismaClient();
    const { deviceId, subscription } = parsed.data;

    await prisma.pushSubscription.upsert({
      where: { deviceId },
      create: {
        deviceId,
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
        subscriptionJson: subscription,
      },
      update: {
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
        subscriptionJson: subscription,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Push subscribe error", error);
    return NextResponse.json({ error: "Push subscription failed" }, { status: 500 });
  }
}
