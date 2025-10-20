// 채팅 임시 목 데이터 - 개발 완료 후 이 폴더 전체 삭제 예정

// Message 타입 정의 (BE Prisma ChattingMessage 기준)
export interface Message {
  id: string;
  chattingRoomId: string;
  senderId: string;
  messageType: "MESSAGE" | "QUOTATION";
  content?: string;
  createdAt: string;
  updatedAt?: string;
  // UI 편의용 필드
  senderName?: string;
  senderAvatar?: string;
  // quotation이 있으면 messageType === QUOTATION
  quotation?: Quotation;
}

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

export interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
}

// 1. 채팅방 목록 데이터
export const conversations: Conversation[] = [
  { id: "1", name: "김기사님 (용달이사)", lastMessage: "네, 12월 첫째 주 가능합니다." },
  { id: "2", name: "박사장님 (포장이사)", lastMessage: "견적 확인 부탁드립니다." },
  { id: "3", name: "최팀장님 (사무실이사)", lastMessage: "알겠습니다." },
];

// 2. 채팅방 ID별 실제 대화 내용 데이터
export const messagesByRoomId: { [key: string]: Message[] } = {
  "1": [
    {
      id: "msg-1",
      chattingRoomId: "1",
      senderId: "driver-123",
      senderName: "김기사",
      senderAvatar: "김",
      messageType: "MESSAGE",
      content: "안녕하세요! 이사 일정 가능하신 날짜 있으실까요?",
      createdAt: new Date().toISOString(),
    },
    {
      id: "msg-2",
      chattingRoomId: "1",
      senderId: "consumer-1",
      senderName: "나",
      senderAvatar: "나",
      messageType: "MESSAGE",
      content: "네, 안녕하세요. 12월 5일이나 6일쯤 생각하고 있습니다.",
      createdAt: new Date().toISOString(),
    },
    {
      id: "msg-3",
      chattingRoomId: "1",
      senderId: "driver-123",
      senderName: "김기사",
      senderAvatar: "김",
      messageType: "MESSAGE",
      content: "네, 12월 첫째 주 가능합니다. 해당 날짜로 예약 도와드릴까요?",
      createdAt: new Date().toISOString(),
    },
    // sample quotation message (submitted)
    {
      id: "msg-101",
      chattingRoomId: "1",
      senderId: "driver-123",
      senderName: "김기사",
      messageType: "QUOTATION",
      createdAt: new Date().toISOString(),
      quotation: {
        id: "quot-101",
        consumerId: "consumer-1",
        driverId: "driver-123",
        chattingRoomId: "1",
        requestId: "req-1",
        serviceType: "HOME_MOVE",
        moveAt: "2025-12-05",
        departureAddress: "서울시 강남구 역삼동",
        departureFloor: 3,
        departurePyeong: 20,
        departureElevator: true,
        arrivalAddress: "서울시 송파구 잠실동",
        arrivalFloor: 5,
        arrivalPyeong: 25,
        arrivalElevator: false,
        additionalRequirements: "포장 서비스 포함",
        price: 250000,
        status: "SUBMITTED",
        createdAt: new Date().toISOString(),
        chattingMessageId: "msg-101",
      },
    },
  ],
  "2": [
    {
      id: "msg-201",
      chattingRoomId: "2",
      senderId: "driver-456",
      senderName: "박사장님",
      senderAvatar: "박",
      messageType: "MESSAGE",
      content: "견적 확인 부탁드립니다.",
      createdAt: new Date().toISOString(),
    },
  ],
  "3": [], // 최팀장님과는 아직 대화 내용이 없음
};
