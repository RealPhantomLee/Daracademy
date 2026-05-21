import { getServerSession } from "next-auth";
import { authOptions } from "@daracademy/auth";
import { prisma } from "@daracademy/database";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as { role?: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const titles = await prisma.title.findMany({
      include: {
        _count: { select: { users: true } },
      },
      orderBy: { tier: "desc" },
    });

    return NextResponse.json(titles);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch titles" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as { role?: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { name, tier, description, badge } = body;

    if (!name || !tier) {
      return NextResponse.json(
        { error: "Name and tier are required" },
        { status: 400 },
      );
    }

    const title = await prisma.title.create({
      data: {
        name,
        tier,
        description,
        badge,
      },
      include: {
        _count: { select: { users: true } },
      },
    });

    return NextResponse.json(title, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create title" },
      { status: 500 },
    );
  }
}
