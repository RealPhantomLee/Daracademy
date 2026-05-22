import { getServerSession } from "next-auth";
import { authOptions } from "@daracademy/auth";
import { prisma } from "@daracademy/database";
import {
  assignmentCreateSchema,
  successResponse,
  errorResponse,
  ErrorCodes,
  HttpStatus,
  validationErrorResponse,
  handleApiError,
} from "@daracademy/api-schema";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      const response = errorResponse("Unauthorized", ErrorCodes.UNAUTHORIZED);
      return NextResponse.json(response, { status: HttpStatus.UNAUTHORIZED });
    }

    // Fetch user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      const response = errorResponse("User not found", ErrorCodes.NOT_FOUND);
      return NextResponse.json(response, { status: HttpStatus.NOT_FOUND });
    }

    // Fetch all assignments for this student
    const assignments = await prisma.assignment.findMany({
      where: {
        assignedToId: user.id,
      },
      orderBy: { dueDate: "asc" },
    });

    const response = successResponse(assignments);
    return NextResponse.json(response, { status: HttpStatus.OK });
  } catch (error) {
    console.error("Failed to fetch assignments:", error);
    const response = await handleApiError(error);
    return NextResponse.json(response, { status: HttpStatus.INTERNAL_ERROR });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      const response = errorResponse("Unauthorized", ErrorCodes.UNAUTHORIZED);
      return NextResponse.json(response, { status: HttpStatus.UNAUTHORIZED });
    }

    // Fetch user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      const response = errorResponse("User not found", ErrorCodes.NOT_FOUND);
      return NextResponse.json(response, { status: HttpStatus.NOT_FOUND });
    }

    // Only allow tutors/admins to create assignments
    if (user.role !== "TUTOR" && user.role !== "ADMIN") {
      const response = errorResponse(
        "Only tutors can create assignments",
        ErrorCodes.FORBIDDEN,
      );
      return NextResponse.json(response, { status: HttpStatus.FORBIDDEN });
    }

    const body = await request.json();

    // Validate input
    const validation = assignmentCreateSchema.safeParse(body);
    if (!validation.success) {
      const response = validationErrorResponse(validation.error);
      return NextResponse.json(response, { status: HttpStatus.BAD_REQUEST });
    }

    const assignment = await prisma.assignment.create({
      data: {
        title: validation.data.title,
        subject: validation.data.subject,
        description: validation.data.description || null,
        dueDate: new Date(validation.data.dueDate),
        attachmentUrl: validation.data.attachmentUrl || null,
        assignedToId: validation.data.assignedToId,
        createdById: user.id,
        status: "ASSIGNED",
      },
    });

    const response = successResponse(assignment);
    return NextResponse.json(response, { status: HttpStatus.CREATED });
  } catch (error) {
    console.error("Failed to create assignment:", error);
    const response = await handleApiError(error);
    return NextResponse.json(response, { status: HttpStatus.INTERNAL_ERROR });
  }
}
