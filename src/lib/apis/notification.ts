import apiClient from "@/lib/apiClient";

export enum NotificationType {
  NEW_QUOTATION = "NEW_QUOTATION",
  QUOTATION_ACCEPTED = "QUOTATION_ACCEPTED",
  NEW_MESSAGE = "NEW_MESSAGE",
  REVIEW_RECEIVED = "REVIEW_RECEIVED",
  INVITE_RECEIVED = "INVITE_RECEIVED",
  INVITE_CANCELLED = "INVITE_CANCELLED",
  REQUEST_CONCLUDED = "REQUEST_CONCLUDED",
  REQUEST_COMPLETED = "REQUEST_COMPLETED",
  REQUEST_EXPIRED = "REQUEST_EXPIRED",
  MOVE_DAY_REMINDER = "MOVE_DAY_REMINDER",
}

export interface NotificationItem {
  id: string;
  type: NotificationType;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface GetNotificationsResponse {
  items: NotificationItem[];
  nextCursor?: string | null;
  hasNext: boolean;
}

export async function getNotifications(params?: { limit?: number; cursor?: string }) {
  const res = await apiClient.get<{ success: boolean; data: GetNotificationsResponse }>(
    "/Notifications",
    { params }
  );
  return res.data.data;
}
