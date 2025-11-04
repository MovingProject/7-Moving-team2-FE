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
  isConnected: boolean;
  currentUser: CurrentUser;
  connectSocket: (url: string) => void;
  disconnectSocket: () => void;
  addMessage: (message: Message) => void;
  setMessages: (messages: Message[]) => void;
  setCurrentUser: (user: CurrentUser) => void;
  updateMessage: (messageId: string, updates: Partial<Message>) => void;
  replaceTempMessage: (tempId: string, realMessage: Message) => void;
}

const useChatStore = create<ChatState>((set, get) => ({
  socket: null,
  messages: [],
  isConnected: false,
  currentUser: {
    id: "consumer-1",
    role: "consumer",
    name: "나",
  },

  // 소켓 연결
  connectSocket: (url) => {
    if (get().socket) return; // 이미 연결되어 있으면 중복 실행 방지

    const newSocket = io(url, {
      transports: ["websocket"],
    });

    newSocket.on("connect", () => {
      set({ isConnected: true });
      console.log("Socket connected!", newSocket.id);
    });

    newSocket.on("disconnect", () => {
      set({ isConnected: false });
      console.log("Socket disconnected!");
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
      // 중복 체크: 같은 ID가 이미 있으면 추가하지 않음
      if (state.messages.some((msg) => msg.id === message.id)) {
        console.warn("⚠️ addMessage: 중복 메시지 무시", message.id);
        return state;
      }
      return { messages: [...state.messages, message] };
    });
  },

  // 메시지 목록 전체 교체 (채팅방 입장 시 초기 데이터 로드용)
  setMessages: (messages) => {
    set({ messages });
  },

  // 현재 사용자 설정 (역할 전환용)
  setCurrentUser: (user) => {
    set({ currentUser: user });
  },

  // 특정 메시지 업데이트 (견적 상태 변경 등)
  updateMessage: (messageId, updates) => {
    set((state) => ({
      messages: state.messages.map((msg) => (msg.id === messageId ? { ...msg, ...updates } : msg)),
    }));
  },

  // tempId를 실제 서버 ID로 교체
  replaceTempMessage: (tempId: string, realMessage: Message) => {
    set((state) => ({
      messages: state.messages.map((msg) => (msg.id === tempId ? realMessage : msg)),
    }));
  },
}));

export default useChatStore;
