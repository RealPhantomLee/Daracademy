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

    // TODO: implement proper guardian-student linking when schema is updated
    // For now, return all students
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
