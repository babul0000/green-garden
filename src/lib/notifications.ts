import { prisma } from "@/lib/prisma";

export type NotificationType =
  | "INFO"
  | "REQUEST"
  | "PROJECT"
  | "TREE_DOCTOR"
  | "TREE_DOCTOR_EMERGENCY"
  | "MAINTENANCE"
  | "PAYMENT"
  | "STOCK_ALERT"
  | "SCHEDULE_CONFLICT";

export interface CreateNotificationInput {
  userId?: string | null;
  title: string;
  message: string;
  type?: NotificationType | string;
  link?: string | null;
}

/**
 * Creates a notification in PostgreSQL.
 * If userId is null or undefined, this notification is visible to studio admins and staff.
 */
export async function createNotification(input: CreateNotificationInput) {
  try {
    return await prisma.notification.create({
      data: {
        userId: input.userId || null,
        title: input.title,
        message: input.message,
        type: input.type || "INFO",
        link: input.link || null,
      },
    });
  } catch (err) {
    console.error("Failed to create notification:", err);
    return null;
  }
}

/**
 * Convenience helper to broadcast a notification to all studio admins.
 */
export async function notifyAdmins(input: Omit<CreateNotificationInput, "userId">) {
  return createNotification({
    ...input,
    userId: null,
  });
}

/**
 * Convenience helper to send a targeted notification to a specific client or user.
 */
export async function notifyUser(userId: string, input: Omit<CreateNotificationInput, "userId">) {
  return createNotification({
    ...input,
    userId,
  });
}
