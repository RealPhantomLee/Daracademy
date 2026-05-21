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

    // Fetch payments for this guardian
    const payments = await prisma.payment.findMany({
      where: {
        userId: guardian.id,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(payments);
  } catch (error) {
    console.error("Error fetching payments:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
