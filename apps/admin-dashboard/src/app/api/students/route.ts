import { getServerSession } from "next-auth";
import { authOptions } from "@daracademy/auth";
import { prisma } from "@daracademy/database";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import {
  userCreateSchema,
  successResponse,
  errorResponse,
  ErrorCodes,
  HttpStatus,
  validationErrorResponse,
  handleApiError,
} from "@daracademy/api-schema";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as { role?: string }).role !== "ADMIN") {
    const response = errorResponse("Unauthorized", ErrorCodes.FORBIDDEN);
    return NextResponse.json(response, { status: HttpStatus.FORBIDDEN });
  }

  try {
    const students = await prisma.user.findMany({
      where: { role: "STUDENT" },
      include: { studentProfile: true },
      orderBy: { createdAt: "desc" },
    });

    const response = successResponse(students);
    return NextResponse.json(response, { status: HttpStatus.OK });
  } catch (error) {
    console.error("Failed to fetch students:", error);
    const response = await handleApiError(error);
    return NextResponse.json(response, { status: HttpStatus.INTERNAL_ERROR });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as { role?: string }).role !== "ADMIN") {
    const response = errorResponse("Unauthorized", ErrorCodes.FORBIDDEN);
    return NextResponse.json(response, { status: HttpStatus.FORBIDDEN });
  }

  try {
    const body = await req.json();

    // Validate input (restrict to STUDENT role for this endpoint)
    const validation = userCreateSchema.safeParse({
      ...body,
      role: "STUDENT",
    });

    if (!validation.success) {
      const response = validationErrorResponse(validation.error);
      return NextResponse.json(response, { status: HttpStatus.BAD_REQUEST });
    }

    const { email, password, name, gradeLevel, subjects } = validation.data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      const response = errorResponse(
        "User with this email already exists",
        ErrorCodes.CONFLICT,
      );
      return NextResponse.json(response, { status: HttpStatus.CONFLICT });
    }

    const hashedPassword = await bcryptjs.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: "STUDENT",
        studentProfile: {
          create: {
            gradeLevel: gradeLevel || undefined,
            subjects: subjects || [],
          },
        },
      },
      include: { studentProfile: true },
    });

    const response = successResponse(user);
    return NextResponse.json(response, { status: HttpStatus.CREATED });
  } catch (error) {
    console.error("Failed to create student:", error);
    const response = await handleApiError(error);
    return NextResponse.json(response, { status: HttpStatus.INTERNAL_ERROR });
  }
}
