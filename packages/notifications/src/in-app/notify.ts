import { prisma, type NotificationType } from "@daracademy/database";

export interface CreateNotificationOptions {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
}

export async function createNotification(
  options: CreateNotificationOptions,
): Promise<{ success: boolean; id?: string; error?: string }> {
  const { userId, type, title, message, data } = options;

  try {
    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        data: data ? JSON.stringify(data) : null,
      },
    });

    return {
      success: true,
      id: notification.id,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return {
      success: false,
      error: errorMessage,
    };
  }
}

export async function markAsRead(
  notificationId: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });

    return { success: true };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return {
      success: false,
      error: errorMessage,
    };
  }
}

export async function markAllAsRead(
  userId: string,
): Promise<{ success: boolean; count?: number; error?: string }> {
  try {
    const result = await prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    return {
      success: true,
      count: result.count,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return {
      success: false,
      error: errorMessage,
    };
  }
}

export async function deleteNotification(
  notificationId: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    await prisma.notification.delete({
      where: { id: notificationId },
    });

    return { success: true };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return {
      success: false,
      error: errorMessage,
    };
  }
}

export async function getUnreadCount(
  userId: string,
): Promise<{ count: number; error?: string }> {
  try {
    const count = await prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });

    return { count };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return {
      count: 0,
      error: errorMessage,
    };
  }
}
