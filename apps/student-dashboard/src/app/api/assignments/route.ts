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

    // Fetch all assignments for this student
    const assignments = await prisma.assignment.findMany({
      where: {
        assignedToId: user.id,
      },
      orderBy: { dueDate: "asc" },
    });

    return NextResponse.json(assignments);
  } catch (error) {
    console.error("Failed to fetch assignments:", error);
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
    const { title, subject, description, dueDate, attachmentUrl } = body;

    if (!title || !subject || !dueDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Only allow tutors/admins to create assignments
    if (user.role !== "TUTOR" && user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only tutors can create assignments" },
        { status: 403 },
      );
    }

    const assignment = await prisma.assignment.create({
      data: {
        title,
        subject,
        description: description || null,
        dueDate: new Date(dueDate),
        attachmentUrl: attachmentUrl || null,
        assignedToId: body.assignedToId,
        createdById: user.id,
        status: "ASSIGNED",
      },
    });

    return NextResponse.json(assignment, { status: 201 });
  } catch (error) {
    console.error("Failed to create assignment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
