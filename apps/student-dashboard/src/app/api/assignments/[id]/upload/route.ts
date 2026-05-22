import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@daracademy/auth";
import { prisma } from "@daracademy/database";
import { uploadToR2 } from "@daracademy/notifications";
import {
  fileUploadSchema,
  successResponse,
  errorResponse,
  ErrorCodes,
  HttpStatus,
  validationErrorResponse,
  handleApiError,
} from "@daracademy/api-schema";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    const response = errorResponse("Unauthorized", ErrorCodes.UNAUTHORIZED);
    return NextResponse.json(response, { status: HttpStatus.UNAUTHORIZED });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      const response = errorResponse("User not found", ErrorCodes.NOT_FOUND);
      return NextResponse.json(response, { status: HttpStatus.NOT_FOUND });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    // Validation 1: File exists
    if (!file) {
      const response = errorResponse(
        "No file provided",
        ErrorCodes.BAD_REQUEST,
      );
      return NextResponse.json(response, { status: HttpStatus.BAD_REQUEST });
    }

    // Validate file
    const validation = fileUploadSchema.safeParse({ file });
    if (!validation.success) {
      const response = validationErrorResponse(validation.error);
      return NextResponse.json(response, { status: HttpStatus.BAD_REQUEST });
    }

    // Validation 4: Assignment exists and user has access
    const assignment = await prisma.assignment.findUnique({
      where: { id },
      include: { assignedTo: true },
    });

    if (!assignment) {
      const response = errorResponse(
        "Assignment not found",
        ErrorCodes.NOT_FOUND,
      );
      return NextResponse.json(response, { status: HttpStatus.NOT_FOUND });
    }

    if (
      assignment.assignedToId !== user.id &&
      user.role !== "ADMIN" &&
      user.role !== "TUTOR"
    ) {
      const response = errorResponse(
        "You do not have permission to upload to this assignment",
        ErrorCodes.FORBIDDEN,
      );
      return NextResponse.json(response, { status: HttpStatus.FORBIDDEN });
    }

    // Upload to R2 with timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout

    try {
      const buffer = Buffer.from(await file.arrayBuffer());
      const timestamp = Date.now();
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const key = `submissions/${assignment.assignedToId}/${id}/${timestamp}-${sanitizedFileName}`;

      const result = await uploadToR2({
        key,
        body: buffer,
        contentType: file.type,
        metadata: {
          assignmentId: id,
          studentId: assignment.assignedToId,
          uploadedBy: user.id,
          uploadedAt: new Date().toISOString(),
        },
      });

      clearTimeout(timeout);

      if (!result.success) {
        console.error(
          "[Assignment Upload] Failed to upload file:",
          result.error,
        );
        const response = errorResponse(
          result.error || "Failed to upload file",
          ErrorCodes.INTERNAL_ERROR,
        );
        return NextResponse.json(response, {
          status: HttpStatus.INTERNAL_ERROR,
        });
      }

      // Update assignment with file URL and mark as SUBMITTED
      const updated = await prisma.assignment.update({
        where: { id },
        data: {
          submissionUrl: result.url,
          status: "SUBMITTED",
        },
      });

      console.log("[Assignment Upload] File uploaded successfully", {
        assignmentId: id,
        fileUrl: result.url,
      });

      const response = successResponse({
        fileUrl: result.url,
        assignment: updated,
      });
      return NextResponse.json(response, { status: HttpStatus.OK });
    } catch (uploadError) {
      clearTimeout(timeout);
      console.error("[Assignment Upload] R2 error:", uploadError);

      if (uploadError instanceof Error) {
        if (uploadError.name === "AbortError") {
          const response = errorResponse(
            "Upload timeout. Please try again.",
            ErrorCodes.INTERNAL_ERROR,
          );
          return NextResponse.json(response, { status: 408 });
        }
        const response = errorResponse(
          uploadError.message,
          ErrorCodes.INTERNAL_ERROR,
        );
        return NextResponse.json(response, {
          status: HttpStatus.INTERNAL_ERROR,
        });
      }

      const response = errorResponse(
        "Failed to upload file",
        ErrorCodes.INTERNAL_ERROR,
      );
      return NextResponse.json(response, { status: HttpStatus.INTERNAL_ERROR });
    }
  } catch (error) {
    console.error("[Assignment Upload] Error:", error);
    const response = await handleApiError(error);
    return NextResponse.json(response, { status: HttpStatus.INTERNAL_ERROR });
  }
}
