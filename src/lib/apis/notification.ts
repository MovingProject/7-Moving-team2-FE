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

export interface RawNotificationItem {
  id: string;
  content: string;
  notificationType: NotificationType;
  createdAt: string;
  readAt: string | null;
}

export interface NotificationItem {
  id: string;
  type: NotificationType;
  content: string;
  createdAt: string;
  readAt: string | null;
}

export interface GetNotificationsResponse {
  items: RawNotificationItem[];
  nextCursor?: string | null;
  hasNext: boolean;
}

/** 알림 목록 조회: 서버의 notificationType -> 프론트의 type 으로 매핑 */
export async function getNotifications(params?: { limit?: number; cursor?: string }): Promise<{
  items: NotificationItem[];
  nextCursor?: string | null;
  hasNext: boolean;
}> {
  const response = await apiClient.get<{ success: boolean; data: GetNotificationsResponse }>(
    "/Notifications",
    { params }
  );

  const raw = response.data.data;

  const items: NotificationItem[] = raw.items.map((n) => ({
    id: n.id,
    type: n.notificationType, // <- 여기서 매핑
    content: n.content,
    createdAt: n.createdAt,
    readAt: n.readAt,
  }));

  return { items, nextCursor: raw.nextCursor ?? null, hasNext: raw.hasNext };
}

/** 개별 알림 읽음 */
export async function markNotificationAsRead(id: string): Promise<void> {
  await apiClient.post("/Notifications/read", { ids: [id] });
}

/** 전체 읽음 (백엔드가 body 없이도 처리 가능하면 인자 생략 가능) */
export async function markAllNotificationsAsRead(ids?: string[]): Promise<void> {
  await apiClient.post("/Notifications/readAll", { ids });
}

export type { NotificationItem as ClientNotificationItem };
