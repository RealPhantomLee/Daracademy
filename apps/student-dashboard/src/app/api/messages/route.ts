import { getServerSession } from "next-auth";
import { authOptions } from "@daracademy/auth";
import { prisma } from "@daracademy/database";
import {
  messageCreateSchema,
  successResponse,
  errorResponse,
  ErrorCodes,
  HttpStatus,
  validationErrorResponse,
  handleApiError,
} from "@daracademy/api-schema";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      const response = errorResponse("Unauthorized", ErrorCodes.UNAUTHORIZED);
      return NextResponse.json(response, { status: HttpStatus.UNAUTHORIZED });
    }

    // Fetch user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      const response = errorResponse("User not found", ErrorCodes.NOT_FOUND);
      return NextResponse.json(response, { status: HttpStatus.NOT_FOUND });
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
    const response = successResponse(threadList);
    return NextResponse.json(response, { status: HttpStatus.OK });
  } catch (error) {
    console.error("Failed to fetch messages:", error);
    const response = await handleApiError(error);
    return NextResponse.json(response, { status: HttpStatus.INTERNAL_ERROR });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      const response = errorResponse("Unauthorized", ErrorCodes.UNAUTHORIZED);
      return NextResponse.json(response, { status: HttpStatus.UNAUTHORIZED });
    }

    // Fetch user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      const response = errorResponse("User not found", ErrorCodes.NOT_FOUND);
      return NextResponse.json(response, { status: HttpStatus.NOT_FOUND });
    }

    const body = await request.json();

    // Validate input
    const validation = messageCreateSchema.safeParse(body);
    if (!validation.success) {
      const response = validationErrorResponse(validation.error);
      return NextResponse.json(response, { status: HttpStatus.BAD_REQUEST });
    }

    const message = await prisma.message.create({
      data: {
        senderId: user.id,
        receiverId: validation.data.receiverId,
        content: validation.data.content,
        isRead: false,
      },
      include: {
        sender: { select: { id: true, name: true, email: true } },
        receiver: { select: { id: true, name: true, email: true } },
      },
    });

    const response = successResponse(message);
    return NextResponse.json(response, { status: HttpStatus.CREATED });
  } catch (error) {
    console.error("Failed to create message:", error);
    const response = await handleApiError(error);
    return NextResponse.json(response, { status: HttpStatus.INTERNAL_ERROR });
  }
}
