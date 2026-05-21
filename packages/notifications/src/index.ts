export { sendEmail, type SendEmailOptions } from "./email/client";
export {
  WelcomeEmail,
  SessionReminderEmail,
  AssignmentDueEmail,
  type WelcomeEmailProps,
  type SessionReminderEmailProps,
  type AssignmentDueEmailProps,
} from "./email/templates";
export {
  uploadToR2,
  getSignedDownloadUrl,
  deleteFromR2,
  type UploadOptions,
} from "./storage/r2";
export {
  createNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount,
  type CreateNotificationOptions,
} from "./in-app/notify";
