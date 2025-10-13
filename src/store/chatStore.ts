
import { create } from 'zustand';
import { Socket, io } from 'socket.io-client';

// 메시지 타입 정의 (임시, 추후 백엔드와 동기화 필요)
interface Message {
  id: number | string;
  sender: string;
  text: string;
  time: string;
  type: 'incoming' | 'outgoing';
}

interface ChatState {
  socket: Socket | null;
  messages: Message[];
  isConnected: boolean;
  connectSocket: (url: string) => void;
  disconnectSocket: () => void;
  addMessage: (message: Message) => void;
  setMessages: (messages: Message[]) => void;
}

const useChatStore = create<ChatState>((set, get) => ({
  socket: null,
  messages: [],
  isConnected: false,

  // 소켓 연결
  connectSocket: (url) => {
    if (get().socket) return; // 이미 연결되어 있으면 중복 실행 방지

    const newSocket = io(url, {
      transports: ['websocket'],
    });

    newSocket.on('connect', () => {
      set({ isConnected: true });
      console.log('Socket connected!', newSocket.id);
    });

    newSocket.on('disconnect', () => {
      set({ isConnected: false });
      console.log('Socket disconnected!');
    });

    // TODO: 'receiveMessage' 이벤트 명은 백엔드와 협의 필요
    newSocket.on('receiveMessage', (message: Message) => {
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
    set((state) => ({ messages: [...state.messages, message] }));
  },

  // 메시지 목록 전체 교체 (채팅방 입장 시 초기 데이터 로드용)
  setMessages: (messages) => {
    set({ messages });
  },
}));

export default useChatStore;
