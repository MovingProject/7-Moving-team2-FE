import { create } from "zustand";
import { Socket, io } from "socket.io-client";
import { type Message } from "@/types/chat";

interface CurrentUser {
  id: string;
  role: "consumer" | "driver";
  name: string;
}

interface ChatState {
  socket: Socket | null;
  messages: Message[];
  messagesByRoom: Record<string, Message[]>; // roomId별 메시지 캐싱 (DB + 실시간)
  currentRoomId: string | null; // 현재 보고 있는 방
  isConnected: boolean;
  currentUser: CurrentUser;
  readRooms: Set<string>; // 읽음 처리된 roomId 추적
  connectSocket: (url: string) => void;
  disconnectSocket: () => void;
  setCurrentRoom: (roomId: string) => void; // 현재 방 설정 (메시지 전환용)
  addMessage: (message: Message) => void;
  setMessages: (messages: Message[]) => void;
  setCurrentUser: (user: CurrentUser) => void;
  updateMessage: (messageId: string, updates: Partial<Message>) => void;
  replaceTempMessage: (tempId: string, realMessage: Message) => void;
  markRoomAsRead: (roomId: string) => void; // 룸을 읽음으로 표시
  unmarkRoomAsRead: (roomId: string) => void; // 새 메시지 오면 다시 미읽음으로
}

// localStorage에서 읽음 방 목록 불러오기
const loadReadRooms = (): Set<string> => {
  if (typeof window === "undefined") return new Set();
  try {
    const saved = localStorage.getItem("chatReadRooms");
    return saved ? new Set(JSON.parse(saved)) : new Set();
  } catch {
    return new Set();
  }
};

// localStorage에 읽음 방 목록 저장하기
const saveReadRooms = (rooms: Set<string>) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("chatReadRooms", JSON.stringify([...rooms]));
  } catch (error) {
    console.error("readRooms 저장 실패:", error);
  }
};

const useChatStore = create<ChatState>((set, get) => ({
  socket: null,
  messages: [],
  messagesByRoom: {}, // 빈 객체로 초기화
  currentRoomId: null,
  isConnected: false,
  currentUser: {
    id: "consumer-1",
    role: "consumer",
    name: "나",
  },
  readRooms: loadReadRooms(), // localStorage에서 복원

  // 현재 채팅방 설정 및 메시지 전환
  setCurrentRoom: (roomId: string) => {
    const state = get();
    set({
      currentRoomId: roomId,
      messages: state.messagesByRoom[roomId] || [],
    });
  },

  // 소켓 연결
  connectSocket: (url) => {
    if (get().socket) return; // 이미 연결되어 있으면 중복 실행 방지

    const newSocket = io(url, {
      transports: ["websocket"],
    });

    newSocket.on("connect", () => {
      set({ isConnected: true });
    });

    newSocket.on("disconnect", () => {
      set({ isConnected: false });
    });

    // TODO: 'receiveMessage' 이벤트 명은 백엔드와 협의 필요
    newSocket.on("receiveMessage", (message: Message) => {
      get().addMessage(message);
    });

    set({ socket: newSocket });
  },

  // 소켓 연결 해제
  disconnectSocket: () => {
    get().socket?.disconnect();
    set({ socket: null, isConnected: false });
  },

  // 메시지 목록에 새 메시지 추가
  addMessage: (message) => {
    set((state) => {
      const roomId = message.chattingRoomId;

      // 중복 체크: 같은 ID가 이미 있으면 추가하지 않음
      if (state.messages.some((msg) => msg.id === message.id)) {
        console.warn("⚠️ addMessage: 중복 메시지 무시", message.id);
        return state;
      }

      // 현재 messages와 messagesByRoom 모두 업데이트
      const newMessages = [...state.messages, message];
      const roomMessages = state.messagesByRoom[roomId] || [];
      const newRoomMessages = roomMessages.some((msg) => msg.id === message.id)
        ? roomMessages
        : [...roomMessages, message];

      // 다른 방에서 메시지가 오면 readRooms에서 제거 (unread로 표시)
      const newReadRooms = new Set(state.readRooms);
      if (roomId !== state.currentRoomId) {
        newReadRooms.delete(roomId);
        saveReadRooms(newReadRooms);
      }

      return {
        messages: newMessages,
        messagesByRoom: {
          ...state.messagesByRoom,
          [roomId]: newRoomMessages,
        },
        readRooms: newReadRooms,
      };
    });
  },

  // 메시지 목록 전체 교체 (채팅방 입장 시 초기 데이터 로드용)
  setMessages: (messages) => {
    set((state) => {
      if (!state.currentRoomId) {
        return { messages };
      }

      // DB 데이터를 그대로 사용 (새로고침 시 DB가 최신 상태)

      // messagesByRoom에도 저장
      return {
        messages,
        messagesByRoom: {
          ...state.messagesByRoom,
          [state.currentRoomId]: messages,
        },
      };
    });
  },

  // 현재 사용자 설정 (역할 전환용)
  setCurrentUser: (user) => {
    set({ currentUser: user });
  },

  // 특정 메시지 업데이트 (견적 상태 변경 등)
  updateMessage: (messageId, updates) => {
    set((state) => {
      const newMessages = state.messages.map((msg) =>
        msg.id === messageId ? { ...msg, ...updates } : msg
      );

      // messagesByRoom도 업데이트
      const updatedMessagesByRoom = { ...state.messagesByRoom };
      Object.keys(updatedMessagesByRoom).forEach((roomId) => {
        updatedMessagesByRoom[roomId] = updatedMessagesByRoom[roomId].map((msg) =>
          msg.id === messageId ? { ...msg, ...updates } : msg
        );
      });

      return {
        messages: newMessages,
        messagesByRoom: updatedMessagesByRoom,
      };
    });
  },

  // tempId를 실제 서버 ID로 교체
  replaceTempMessage: (tempId: string, realMessage: Message) => {
    set((state) => {
      const newMessages = state.messages.map((msg) => (msg.id === tempId ? realMessage : msg));

      // messagesByRoom도 업데이트
      const roomId = realMessage.chattingRoomId;
      const updatedMessagesByRoom = { ...state.messagesByRoom };
      if (updatedMessagesByRoom[roomId]) {
        updatedMessagesByRoom[roomId] = updatedMessagesByRoom[roomId].map((msg) =>
          msg.id === tempId ? realMessage : msg
        );
      }

      return {
        messages: newMessages,
        messagesByRoom: updatedMessagesByRoom,
      };
    });
  },

  // 채팅방을 읽음으로 표시
  markRoomAsRead: (roomId: string) => {
    set((state) => {
      const newReadRooms = new Set(state.readRooms);
      newReadRooms.add(roomId);
      saveReadRooms(newReadRooms); // localStorage에 저장
      return { readRooms: newReadRooms };
    });
  },

  // 새 메시지가 오면 다시 미읽음으로 표시
  unmarkRoomAsRead: (roomId: string) => {
    set((state) => {
      const newReadRooms = new Set(state.readRooms);
      newReadRooms.delete(roomId);
      saveReadRooms(newReadRooms); // localStorage에 저장
      return { readRooms: newReadRooms };
    });
  },
}));

export default useChatStore;
