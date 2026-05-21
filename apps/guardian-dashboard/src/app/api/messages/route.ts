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

    // Fetch messages (both received and sent)
    const [received, sent] = await Promise.all([
      prisma.message.findMany({
        where: {
          receiverId: guardian.id,
        },
        include: {
          sender: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.message.findMany({
        where: {
          senderId: guardian.id,
        },
        include: {
          receiver: true,
        },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return NextResponse.json({
      received,
      sent,
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
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

    const body = await request.json();
    const { receiverId, content } = body;

    if (!receiverId || !content) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        senderId: guardian.id,
        receiverId,
        content,
      },
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
