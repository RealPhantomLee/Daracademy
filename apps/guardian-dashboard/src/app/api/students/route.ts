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

    // Fetch guardian user
    const guardian = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!guardian) {
      return NextResponse.json(
        { error: "Guardian not found" },
        { status: 404 },
      );
    }

    // SECURITY: Guardians can only view students linked to them
    // TODO: Implement proper guardian-student linking when schema is updated
    // Currently, we reject all requests until guardian-student relationships are defined.
    // Once schema supports StudentGuardian junction table, filter by:
    // where: { role: "STUDENT", guardians: { some: { guardianId: guardian.id } } }
    if (guardian.role !== "ADMIN") {
      return NextResponse.json(
        {
          error:
            "Guardian-student relationships not yet configured. Contact admin.",
        },
        { status: 403 },
      );
    }

    // Admins can view all students (temporary until proper guardian linking exists)
    const students = await prisma.user.findMany({
      where: {
        role: "STUDENT",
      },
      include: {
        studentProfile: true,
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
