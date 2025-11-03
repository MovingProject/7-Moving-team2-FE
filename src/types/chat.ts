// 채팅 메시지 타입
export type MessageType = "MESSAGE" | "QUOTATION";

// 채팅 메시지 인터페이스
export interface ChatMessage {
  id: string;
  chattingRoomId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  messageType: MessageType;
  content: string | null;
  createdAt: string;
  sequence?: number;
  quotation?: {
    id?: string;
    quotationId?: string;
    serviceType?: string;
    moveAt?: string;
    departureAddress?: string;
    arrivalAddress?: string;
    additionalRequirements?: string;
    quotationMessage?: string;
    price?: number;
    status?: string;
    createdAt?: string;
    chattingMessageId?: string;
  };
}

// 백엔드 메시지 응답 타입
export interface BackendChatMessage {
  id: string;
  chattingRoomId: string;
  senderId: string;
  content: string | null;
  messageType: MessageType;
  sequence: number;
  createdAt: string;
  updatedAt: string;
  quotation?: {
    id: string;
    price: number;
    moveAt: string;
    departureAddress: string;
    arrivalAddress: string;
  } | null;
  isMine: boolean;
}

// 채팅방 메시지 조회 응답
export interface GetChatMessagesResponse {
  roomId: string;
  messages: BackendChatMessage[];
  pageInfo: {
    hasNext: boolean;
    nextCursor: string | null;
  };
  lastReadMessageId?: string | null;
}

// WebSocket 새 메시지 이벤트 데이터
export interface WebSocketNewMessageData {
  roomId: string;
  msg: {
    id: string;
    authorId: string;
    messageType: MessageType;
    body?: string;
    quotationId?: string;
    sentAt: string;
  };
}

// 채팅방 정보 (채팅방 목록용)
export interface ChatRoomInfo {
  id: string;
  name: string;
  lastMessage?: string;
  lastMessageAt?: string;
}
