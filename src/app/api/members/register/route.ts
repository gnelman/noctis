import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { pseudo, age, gender, status, city, country, lookingFor, bio, phone } =
      await req.json();

    if (!pseudo || !age || !gender || !status || !city || !country || !lookingFor) {
      return NextResponse.json(
        { error: "Tous les champs obligatoires doivent etre remplis" },
        { status: 400 }
      );
    }

    if (parseInt(age) < 18) {
      return NextResponse.json(
        { error: "Tu dois avoir au moins 18 ans" },
        { status: 400 }
      );
    }

    const existingPseudo = await prisma.member.findUnique({
      where: { pseudo },
    });

    if (existingPseudo) {
      return NextResponse.json(
        { error: "Ce pseudo est deja pris" },
        { status: 400 }
      );
    }

    const trialEnd = new Date();
    trialEnd.setDate(trialEnd.getDate() + 3);

    const member = await prisma.member.create({
      data: {
        phone: phone || "",
        pseudo,
        age: parseInt(age),
        gender,
        status,
        city,
        country,
        lookingFor,
        bio: bio || "",
        trialEnd,
      },
    });

    return NextResponse.json({ success: true, memberId: member.id });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}