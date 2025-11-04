import apiClient from "@/lib/apiClient";
import { GetChatMessagesResponse, ChatRoomListItem } from "@/types/chat";

/**
 * 채팅방 생성 또는 조회 (드라이버 전용)
 * @param requestId - 견적 요청 ID
 * @param consumerId - 소비자 ID
 * @returns roomId - 생성되거나 조회된 채팅방 ID
 */
export const createOrGetChatRoom = async (
  requestId: string,
  consumerId: string
): Promise<{ roomId: string }> => {
  console.log("🚀 createOrGetChatRoom called with:", { requestId, consumerId });

  const response = await apiClient.post<{ success: boolean; data: { roomId: string } }>(
    "/chatting-rooms",
    {
      requestId,
      consumerId,
    }
  );

  console.log("✅ createOrGetChatRoom response:", response.data);

  // 백엔드 응답 구조: { success: true, data: { roomId: "..." } }
  if (response.data.success && response.data.data) {
    return response.data.data; // { roomId: "..." }
  }

  throw new Error("채팅방 생성에 실패했습니다.");
};

/**
 * 채팅방 메시지 조회
 * @param roomId - 채팅방 ID
 * @param cursor - 페이징 커서 (optional)
 * @param limit - 조회 개수 (default: 30)
 */
export const getChatMessages = async (roomId: string, cursor?: string, limit?: number) => {
  console.log("📨 getChatMessages called with:", { roomId, cursor, limit });

  if (!roomId || roomId === "undefined") {
    throw new Error(`Invalid roomId: ${roomId}`);
  }

  const params = new URLSearchParams();
  if (cursor) params.append("cursor", cursor);
  if (limit) params.append("limit", limit.toString());

  const url = params.toString()
    ? `/chatting-rooms/${roomId}/messages?${params.toString()}`
    : `/chatting-rooms/${roomId}/messages`;

  console.log("📡 Requesting URL:", url);
  const response = await apiClient.get<{ success: boolean; data: GetChatMessagesResponse }>(url);
  console.log("✅ Response received:", response.data);

  // 백엔드 응답 구조: { success: true, data: { messages: [...], nextCursor: "..." } }
  if (response.data.success && response.data.data) {
    return response.data.data;
  }

  throw new Error("메시지 조회에 실패했습니다.");
};

/**
 * 내 채팅방 목록 조회
 * @returns 채팅방 목록
 */
export const getMyChatRooms = async () => {
  console.log("📋 getMyChatRooms called");

  const response = await apiClient.get<{ success: boolean; data: ChatRoomListItem[] }>(
    "/chatting-rooms/my"
  );
  console.log("✅ getMyChatRooms response:", response.data);

  // 백엔드 응답 구조: { success: true, data: [...] }
  if (response.data.success && response.data.data) {
    return response.data.data;
  }

  throw new Error("채팅방 목록 조회에 실패했습니다.");
};
