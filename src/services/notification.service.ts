import { prisma } from "../config/db";

export class NotificationService {
  /**
   * Fetches user in-app notifications.
   */
  static async getUserNotifications(userId: string) {
    return await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 20,
    });
  }

  /**
   * Helper function to trigger multi-channel notifications (In-App, Email, SMS).
   */
  static async createNotification(userId: string, title: string, body: string, channel: "IN_APP" | "EMAIL" | "SMS" = "IN_APP") {
    // In-App Notification Record
    const notif = await prisma.notification.create({
      data: {
        userId,
        title,
        body,
        channel,
      },
    });

    // Mock Email / SMS Sender Logger (Development Mode)
    console.log(`📡 [NOTIFICATION_${channel}] To User: ${userId} | Title: "${title}" | Body: "${body}"`);

    return notif;
  }
}
