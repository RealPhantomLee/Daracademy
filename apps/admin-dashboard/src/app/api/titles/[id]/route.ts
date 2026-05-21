import { getServerSession } from "next-auth";
import { authOptions } from "@daracademy/auth";
import { prisma } from "@daracademy/database";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session || (session.user as { role?: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const title = await prisma.title.findUnique({
      where: { id },
      include: {
        users: true,
        _count: { select: { users: true } },
      },
    });

    if (!title) {
      return NextResponse.json({ error: "Title not found" }, { status: 404 });
    }

    return NextResponse.json(title);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch title" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session || (session.user as { role?: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { name, tier, description, badge } = body;

    const title = await prisma.title.update({
      where: { id },
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

    return NextResponse.json(title);
  } catch {
    return NextResponse.json(
      { error: "Failed to update title" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session || (session.user as { role?: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    await prisma.title.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete title" },
      { status: 500 },
    );
  }
}
