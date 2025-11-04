// 채팅 메시지 타입
export type MessageType = "MESSAGE" | "QUOTATION";

// Quotation 타입 (BE Prisma Quotation 기준)
export interface Quotation {
  id: string;
  consumerId: string;
  driverId: string;
  chattingRoomId: string;
  requestId: string;
  serviceType: string;
  moveAt: string;
  departureAddress: string;
  departureFloor: number;
  departurePyeong: number;
  departureElevator: boolean;
  arrivalAddress: string;
  arrivalFloor: number;
  arrivalPyeong: number;
  arrivalElevator: boolean;
  additionalRequirements?: string;
  quotationMessage?: string;
  price: number;
  status: "SUBMITTED" | "REVISED" | "WITHDRAWN" | "SELECTED" | "EXPIRED";
  previousQuotationId?: string;
  selectedAt?: string;
  validUntil?: string;
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string;
  chattingMessageId: string;
}

// Message 타입 (BE Prisma ChattingMessage 기준)
export interface Message {
  id: string;
  chattingRoomId: string;
  senderId: string;
  messageType: "MESSAGE" | "QUOTATION";
  content?: string | null;
  createdAt: string;
  updatedAt?: string;
  // UI 편의용 필드
  senderName?: string;
  senderAvatar?: string;
  // quotation이 있으면 messageType === QUOTATION
  quotation?: Quotation;
}

// 채팅 메시지 인터페이스 (레거시 - 호환용)
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
    tempId?: string; // 클라이언트에서 보낸 임시 ID (낙관적 업데이트 교체용)
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
