import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { prisma } from "@/lib/prisma";
import { signIn } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { phone, code } = await req.json();

  if (!phone || !code) {
    return NextResponse.json(
      { error: "Données manquantes" },
      { status: 400 }
    );
  }

  const storedCode = await redis.get(`otp:${phone}`);

  if (!storedCode || storedCode !== code) {
    return NextResponse.json(
      { error: "Code incorrect ou expiré" },
      { status: 401 }
    );
  }

  await redis.del(`otp:${phone}`);

  let member = await prisma.member.findUnique({
    where: { phone },
  });

  if (!member) {
    return NextResponse.json(
      { redirect: "/register", phone },
      { status: 200 }
    );
  }

  await signIn("credentials", {
    phone,
    code,
    redirect: false,
  });

  return NextResponse.json({ success: true });
}