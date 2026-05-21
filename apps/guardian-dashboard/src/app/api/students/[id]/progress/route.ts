import { getServerSession } from "next-auth";
import { authOptions } from "@daracademy/auth";
import { prisma } from "@daracademy/database";
import { NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: studentId } = await params;

    // Fetch student
    const student = await prisma.user.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // Fetch assignments
    const assignments = await prisma.assignment.findMany({
      where: { assignedToId: studentId },
    });

    // Fetch sessions
    const sessions = await prisma.tutoringSession.findMany({
      where: { studentId },
    });

    // Fetch feedback/grades
    const feedback = await prisma.sessionFeedback.findMany({
      where: { givenToId: studentId },
    });

    // Calculate progress by subject
    const subjectsMap = new Map<string, { completed: number; total: number }>();
    assignments.forEach((assignment) => {
      const key = assignment.subject;
      const current = subjectsMap.get(key) || { completed: 0, total: 0 };
      current.total += 1;
      if (
        assignment.status === "GRADED" ||
        assignment.status === "SUBMITTED" ||
        assignment.status === "RETURNED"
      ) {
        current.completed += 1;
      }
      subjectsMap.set(key, current);
    });

    const progressData = Array.from(subjectsMap.entries()).map(
      ([subject, data]) => ({
        subject,
        ...data,
      }),
    );

    return NextResponse.json({
      studentId,
      studentName: student.name,
      assignmentCount: assignments.length,
      sessionCount: sessions.length,
      feedbackCount: feedback.length,
      progress: progressData,
    });
  } catch (error) {
    console.error("Error fetching progress:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
