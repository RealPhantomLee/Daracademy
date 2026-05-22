import { getServerSession } from "next-auth";
import { authOptions } from "@daracademy/auth";
import { prisma } from "@daracademy/database";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
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

    // Fetch assignment
    const assignment = await prisma.assignment.findUnique({
      where: { id: id },
      include: {
        assignedTo: { select: { id: true, name: true, email: true } },
        createdBy: { select: { id: true, name: true, email: true } },
      },
    });

    if (!assignment) {
      return NextResponse.json(
        { error: "Assignment not found" },
        { status: 404 },
      );
    }

    // Check if user has permission to view
    if (
      assignment.assignedToId !== user.id &&
      assignment.createdById !== user.id &&
      user.role !== "ADMIN"
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(assignment);
  } catch (error) {
    console.error("Failed to fetch assignment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
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

    // Fetch assignment
    const assignment = await prisma.assignment.findUnique({
      where: { id: id },
    });

    if (!assignment) {
      return NextResponse.json(
        { error: "Assignment not found" },
        { status: 404 },
      );
    }

    // Check permissions
    if (
      assignment.assignedToId !== user.id &&
      assignment.createdById !== user.id &&
      user.role !== "ADMIN"
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { status, submissionUrl, grade, feedback } = body;

    // SECURITY: Only tutors and admins can update grades and feedback
    const isGradingRequest = grade !== undefined || feedback;
    if (isGradingRequest && user.role !== "TUTOR" && user.role !== "ADMIN") {
      console.warn(
        `[Assignment] SECURITY: Student ${user.id} attempted to update grade/feedback on assignment ${id}`,
      );
      return NextResponse.json(
        { error: "Students cannot update grades or feedback" },
        { status: 403 },
      );
    }

    // Students can only update status and submission URL
    const updateData: Record<string, unknown> = {};
    if (status) updateData.status = status;
    if (submissionUrl) updateData.submissionUrl = submissionUrl;

    // Tutors and admins can update all fields
    if (user.role === "TUTOR" || user.role === "ADMIN") {
      if (grade !== undefined) updateData.grade = grade;
      if (feedback) updateData.feedback = feedback;
    }

    const updated = await prisma.assignment.update({
      where: { id: id },
      data: updateData,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to update assignment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
