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

// 채팅방 목록 - 상대방 정보
export interface OtherUserInfo {
  userId: string;
  role: "CONSUMER" | "DRIVER";
  name: string;
  displayName: string;
  avatarUrl?: string | null;
}

// 채팅방 목록 - 마지막 메시지
export interface LastMessageInfo {
  id: string;
  type: MessageType;
  content: string | null;
  createdAt: string;
}

// 채팅방 목록 아이템
export interface ChatRoomListItem {
  roomId: string;
  other: OtherUserInfo;
  lastMessage: LastMessageInfo | null;
  unreadCount: number;
  updatedAt: string;
  closed: boolean;
}

// 채팅방 정보 (채팅방 목록용) - 레거시
export interface ChatRoomInfo {
  id: string;
  name: string;
  lastMessage?: string;
  lastMessageAt?: string;
}
