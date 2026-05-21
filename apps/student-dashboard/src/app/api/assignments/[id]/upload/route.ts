import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@daracademy/auth";
import { prisma } from "@daracademy/database";
import { uploadToR2 } from "@daracademy/notifications";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Verify student owns this assignment
    const assignment = await prisma.assignment.findUnique({
      where: { id },
      include: { assignedTo: true },
    });

    if (!assignment) {
      return NextResponse.json(
        { error: "Assignment not found" },
        { status: 404 },
      );
    }

    if (
      assignment.assignedToId !== user.id &&
      user.role !== "ADMIN" &&
      user.role !== "TUTOR"
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Upload to R2
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

    if (!result.success) {
      console.error("[Assignment Upload] Failed to upload file:", result.error);
      return NextResponse.json(
        { error: result.error || "Failed to upload file" },
        { status: 500 },
      );
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

    return NextResponse.json({
      success: true,
      fileUrl: result.url,
      assignment: updated,
    });
  } catch (error) {
    console.error("[Assignment Upload] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
