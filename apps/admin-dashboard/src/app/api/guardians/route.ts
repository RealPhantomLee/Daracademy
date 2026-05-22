import { getServerSession } from "next-auth";
import { authOptions } from "@daracademy/auth";
import { prisma } from "@daracademy/database";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as { role?: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const guardians = await prisma.user.findMany({
      where: { role: "GUARDIAN" },
      include: { guardianProfile: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(guardians);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch guardians" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as { role?: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const {
      email,
      password,
      name,
      relationship,
      emergencyPhone,
      preferredContact,
    } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 },
      );
    }

    const hashedPassword = await bcryptjs.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: "GUARDIAN",
        guardianProfile: {
          create: {
            relationship,
            emergencyPhone,
            preferredContact,
          },
        },
      },
      include: { guardianProfile: true },
    });

    return NextResponse.json(user, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create guardian" },
      { status: 500 },
    );
  }
}
