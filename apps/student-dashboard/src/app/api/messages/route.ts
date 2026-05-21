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

    // Fetch user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch all messages where user is receiver (inbox)
    const messages = await prisma.message.findMany({
      where: {
        receiverId: user.id,
      },
      include: {
        sender: { select: { id: true, name: true, email: true, image: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    // Group messages by sender to create conversation threads
    interface MessageThread {
      id: string;
      senderId: string;
      senderName: string;
      senderImage: string | null;
      lastMessage: string;
      lastMessageTime: Date;
      isRead: boolean;
      unreadCount: number;
    }
    const threads: Record<string, MessageThread> = {};

    messages.forEach((msg) => {
      if (!threads[msg.senderId]) {
        threads[msg.senderId] = {
          id: msg.senderId,
          senderId: msg.senderId,
          senderName: msg.sender.name || msg.sender.email || "Unknown",
          senderImage: msg.sender.image,
          lastMessage: msg.content,
          lastMessageTime: msg.createdAt,
          isRead: msg.isRead,
          unreadCount: 0,
        };
      }

      if (!msg.isRead) {
        threads[msg.senderId].unreadCount += 1;
      }
    });

    const threadList = Object.values(threads);
    return NextResponse.json(threadList);
  } catch (error) {
    console.error("Failed to fetch messages:", error);
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

    // Fetch user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await request.json();
    const { receiverId, content } = body;

    if (!receiverId || !content) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const message = await prisma.message.create({
      data: {
        senderId: user.id,
        receiverId,
        content,
        isRead: false,
      },
      include: {
        sender: { select: { id: true, name: true, email: true } },
        receiver: { select: { id: true, name: true, email: true } },
      },
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error("Failed to create message:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
