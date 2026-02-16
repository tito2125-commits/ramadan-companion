import { NextRequest, NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/prisma";
import { unsubscribePayloadSchema } from "@/lib/validators";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const parsed = unsubscribePayloadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const prisma = getPrismaClient();

    await prisma.pushSubscription.deleteMany({
      where: { deviceId: parsed.data.deviceId },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Push unsubscribe error", error);
    return NextResponse.json({ error: "Push unsubscribe failed" }, { status: 500 });
  }
}
