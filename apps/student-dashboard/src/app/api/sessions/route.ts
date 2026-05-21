import { getServerSession } from "next-auth";
import { authOptions } from "@daracademy/auth";
import { prisma } from "@daracademy/database";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch tutoring sessions for this user (either as tutor or student)
    let sessions;

    if (user.role === "STUDENT") {
      // Student: fetch sessions where they are the student
      sessions = await prisma.tutoringSession.findMany({
        where: {
          studentId: user.id,
        },
        include: {
          tutor: { select: { id: true, name: true, email: true } },
          student: { select: { id: true, name: true, email: true } },
        },
        orderBy: { startTime: "asc" },
      });
    } else if (user.role === "TUTOR") {
      // Tutor: fetch sessions where they are the tutor
      sessions = await prisma.tutoringSession.findMany({
        where: {
          tutorId: user.id,
        },
        include: {
          tutor: { select: { id: true, name: true, email: true } },
          student: { select: { id: true, name: true, email: true } },
        },
        orderBy: { startTime: "asc" },
      });
    } else {
      // Admin or other: fetch all sessions
      sessions = await prisma.tutoringSession.findMany({
        include: {
          tutor: { select: { id: true, name: true, email: true } },
          student: { select: { id: true, name: true, email: true } },
        },
        orderBy: { startTime: "asc" },
      });
    }

    // Format response for student dashboard
    const formatted = sessions.map((s) => ({
      id: s.id,
      title: s.title,
      subject: s.subject,
      tutorName: s.tutor.name || s.tutor.email || "Tutor",
      startTime: s.startTime,
      endTime: s.endTime,
      status: s.status,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Failed to fetch sessions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await request.json();
    const {
      tutorId,
      studentId,
      title,
      subject,
      description,
      startTime,
      endTime,
    } = body;

    if (
      !tutorId ||
      !studentId ||
      !title ||
      !subject ||
      !startTime ||
      !endTime
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Only allow tutors/admins to create sessions
    if (user.role !== "TUTOR" && user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only tutors can create sessions" },
        { status: 403 },
      );
    }

    const newSession = await prisma.tutoringSession.create({
      data: {
        tutorId,
        studentId,
        title,
        subject,
        description: description || null,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        status: "SCHEDULED",
      },
      include: {
        tutor: { select: { id: true, name: true } },
        student: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json(newSession, { status: 201 });
  } catch (error) {
    console.error("Failed to create session:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
