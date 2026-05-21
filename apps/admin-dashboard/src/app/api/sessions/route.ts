import { getServerSession } from "next-auth";
import { authOptions } from "@daracademy/auth";
import { prisma } from "@daracademy/database";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as { role?: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const sessions = await prisma.tutoringSession.findMany({
      include: { student: true, tutor: true },
      orderBy: { startTime: "desc" },
    });

    return NextResponse.json(sessions);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch sessions" },
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
    const { tutorId, studentId, subject, title, startTime, endTime } = body;

    if (!tutorId || !studentId || !subject || !startTime || !endTime) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const tutorSession = await prisma.tutoringSession.create({
      data: {
        tutorId,
        studentId,
        subject,
        title,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        status: "SCHEDULED",
      },
      include: { student: true, tutor: true },
    });

    return NextResponse.json(tutorSession, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 500 },
    );
  }
}
