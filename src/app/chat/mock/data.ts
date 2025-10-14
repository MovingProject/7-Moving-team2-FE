// 채팅 임시 목 데이터 - 개발 완료 후 이 폴더 전체 삭제 예정

// Message 타입 정의
export interface Message {
  id: number;
  sender: string;
  avatar: string;
  text: string;
  time: string;
  type: "incoming" | "outgoing";
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
      id: 1,
      sender: "김기사",
      avatar: "김",
      text: "안녕하세요! 이사 일정 가능하신 날짜 있으실까요?",
      time: "오후 12:02",
      type: "incoming",
    },
    {
      id: 2,
      sender: "나",
      avatar: "나",
      text: "네, 안녕하세요. 12월 5일이나 6일쯤 생각하고 있습니다.",
      time: "오후 12:03",
      type: "outgoing",
    },
    {
      id: 3,
      sender: "김기사",
      avatar: "김",
      text: "네, 12월 첫째 주 가능합니다. 해당 날짜로 예약 도와드릴까요?",
      time: "오후 12:05",
      type: "incoming",
    },
  ],
  "2": [
    {
      id: 1,
      sender: "박사장님",
      avatar: "박",
      text: "견적 확인 부탁드립니다.",
      time: "오전 10:30",
      type: "incoming",
    },
  ],
  "3": [], // 최팀장님과는 아직 대화 내용이 없음
};
