"use client";

import React, { useState, useEffect, useRef } from "react";
import useChatStore from "@/store/chatStore";
import { messagesByRoomId, conversations, type Message, type Conversation } from "../mock/data";

// 이 페이지는 클라이언트 측에서 동적으로 렌더링됩니다.
export default function ChatRoomPage({ params }: { params: Promise<{ roomId: string }> }) {
  const resolvedParams = React.use(params);
  const { socket, messages, addMessage, setMessages } = useChatStore();
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const currentConvo = conversations.find(
    (convo: Conversation) => convo.id === resolvedParams.roomId
  );

  // 스크롤을 맨 아래로 이동시키는 함수
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // 메시지 목록이 변경될 때마다 스크롤을 맨 아래로 이동
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 채팅방에 처음 입장했을 때, 기존 메시지 불러오기 (API 호출로 대체 필요)
  useEffect(() => {
    // TODO: API를 통해 `params.roomId`에 해당하는 채팅 내역을 불러와야 합니다.
    // 현재는 임시 목 데이터에서 채팅 내역을 불러옵니다.
    const roomMessages =
      (messagesByRoomId as { [key: string]: Message[] })[resolvedParams.roomId] || [];
    setMessages(roomMessages);
  }, [resolvedParams.roomId, setMessages]);

  const handleSendMessage = () => {
    if (newMessage.trim() && socket) {
      const messageData = {
        id: Date.now(), // 임시 ID
        sender: "나", // 실제로는 인증 정보에서 가져와야 함
        text: newMessage,
        time: new Date().toLocaleTimeString("ko-KR", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
        type: "outgoing" as const,
      };

      // 서버로 메시지 전송 (이벤트명 'sendMessage'는 백엔드와 일치해야 함)
      socket.emit("sendMessage", { roomId: resolvedParams.roomId, ...messageData });

      // 낙관적 업데이트: 내가 보낸 메시지를 바로 UI에 추가
      addMessage(messageData);
      setNewMessage("");
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* Chat Header - 데스크톱에서만 표시 */}
      <header className="hidden h-16 items-center border-b border-gray-200 bg-white p-4 md:flex">
        <h2 className="text-lg font-bold">
          {currentConvo?.name} (방 ID: {resolvedParams.roomId})
        </h2>
      </header>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto bg-gray-100 p-3 md:p-6">
        <div className="space-y-4 md:space-y-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-end gap-2 ${msg.type === "outgoing" ? "justify-end" : ""}`}
            >
              {msg.type === "incoming" && (
                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-indigo-200 text-xs font-bold text-indigo-600 md:h-8 md:w-8 md:text-sm">
                  {/* {msg.avatar} */}
                </div>
              )}
              <div
                className={`max-w-[280px] rounded-2xl p-2.5 text-sm md:max-w-md md:p-3 md:text-base ${msg.type === "outgoing" ? "bg-blue-500 text-white" : "bg-white"}`}
              >
                <p>{msg.text}</p>
              </div>
              <span className="text-xs text-gray-500">{msg.time}</span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <footer className="h-16 border-t border-gray-200 bg-white p-3 md:h-20 md:p-4">
        <form
          className="flex h-full items-center gap-2 md:gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
        >
          <input
            type="text"
            placeholder="메시지를 입력하세요…"
            className="h-full flex-1 rounded-full bg-gray-100 px-3 text-sm outline-none md:px-4 md:text-base"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button
            type="submit"
            className="flex h-8 w-16 items-center justify-center rounded-full bg-blue-500 text-sm font-medium text-white md:h-10 md:w-20 md:text-base"
          >
            전송
          </button>
        </form>
      </footer>
    </div>
  );
}
