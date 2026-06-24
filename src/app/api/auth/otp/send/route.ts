import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { sendOTP } from "@/lib/sms";

export async function POST(req: NextRequest) {
  const { phone } = await req.json();

  if (!phone) {
    return NextResponse.json(
      { error: "Numéro requis" },
      { status: 400 }
    );
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();

  await redis.set(`otp:${phone}`, code, { ex: 600 });

  await sendOTP(phone, code);

  return NextResponse.json({ success: true });
}