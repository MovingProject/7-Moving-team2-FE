"use client";

import React, { useState, useEffect, useRef } from "react";
import useChatStore from "@/store/chatStore";
import { messagesByRoomId, conversations, type Conversation } from "../mock/data";
import QuotationModal from "@/components/chat/QuotationModal";
import QuotationMessage from "@/components/chat/QuotationMessage";

// 이 페이지는 클라이언트 측에서 동적으로 렌더링됩니다.
export default function ChatRoomPage({ params }: { params: Promise<{ roomId: string }> }) {
  const resolvedParams = React.use(params);
  const { socket, messages, addMessage, setMessages, currentUser, setCurrentUser } = useChatStore();
  const [newMessage, setNewMessage] = useState("");
  const [isQuotationModalOpen, setIsQuotationModalOpen] = useState(false);
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
    const roomMessages = messagesByRoomId[resolvedParams.roomId] || [];
    setMessages(roomMessages);
  }, [resolvedParams.roomId, setMessages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const messageData = {
        id: `msg-${Date.now()}`,
        chattingRoomId: resolvedParams.roomId,
        senderId: currentUser.id,
        senderName: currentUser.name,
        senderAvatar: currentUser.name.charAt(0),
        messageType: "MESSAGE" as const,
        content: newMessage,
        createdAt: new Date().toISOString(),
      };

      // TODO: 서버로 메시지 전송 (이벤트명 'sendMessage'는 백엔드와 일치해야 함)
      // socket?.emit("sendMessage", { roomId: resolvedParams.roomId, ...messageData });

      // 낙관적 업데이트: 내가 보낸 메시지를 바로 UI에 추가
      addMessage(messageData);
      setNewMessage("");
    }
  };

  const handleSendQuotation = (
    price: number,
    message: string,
    requestInfo: {
      serviceType: string;
      moveAt: string;
      departureAddress: string;
      arrivalAddress: string;
      additionalRequirements?: string;
    }
  ) => {
    // TODO: Replace with real API call to POST /quotations
    const quotationMessage = {
      id: `msg-${Date.now()}`,
      chattingRoomId: resolvedParams.roomId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      messageType: "QUOTATION" as const,
      createdAt: new Date().toISOString(),
      quotation: {
        id: `quot-${Date.now()}`,
        consumerId: currentUser.role === "consumer" ? currentUser.id : "consumer-1",
        driverId: currentUser.role === "driver" ? currentUser.id : "driver-123",
        chattingRoomId: resolvedParams.roomId,
        requestId: "req-1",
        serviceType: requestInfo.serviceType,
        moveAt: requestInfo.moveAt,
        departureAddress: requestInfo.departureAddress,
        departureFloor: 3,
        departurePyeong: 20,
        departureElevator: true,
        arrivalAddress: requestInfo.arrivalAddress,
        arrivalFloor: 5,
        arrivalPyeong: 25,
        arrivalElevator: false,
        additionalRequirements: requestInfo.additionalRequirements, // 고객의 원래 요청사항
        quotationMessage: message, // 기사의 견적 추가 설명
        price: price,
        status: "SUBMITTED" as const,
        createdAt: new Date().toISOString(),
        chattingMessageId: `msg-${Date.now()}`,
      },
    };

    addMessage(quotationMessage);
  };

  return (
    <div className="flex h-full flex-col">
      {/* Chat Header - 데스크톱에서만 표시 */}
      <header className="hidden h-16 items-center border-b border-gray-200 bg-white p-4 md:flex">
        <h2 className="text-lg font-bold">{currentConvo?.name}</h2>

        {/* TODO: 백엔드 연동 후 아래 개발용 토글 버튼 삭제 */}
        {/* Dev Only: Role Toggle for testing - REMOVE in production */}
        <div className="ml-auto flex items-center gap-2 rounded-lg border border-blue-300 bg-blue-100 p-1">
          <button
            onClick={() => setCurrentUser({ id: "consumer-1", role: "consumer", name: "나" })}
            className={`rounded px-3 py-1 text-sm font-medium ${
              currentUser.role === "consumer" ? "bg-white text-blue-600 shadow" : "text-gray-600"
            }`}
          >
            고객
          </button>
          <button
            onClick={() => setCurrentUser({ id: "driver-123", role: "driver", name: "김기사" })}
            className={`rounded px-3 py-1 text-sm font-medium ${
              currentUser.role === "driver" ? "bg-white text-blue-600 shadow" : "text-gray-600"
            }`}
          >
            기사
          </button>
        </div>
      </header>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto bg-gray-100 p-3 md:p-6">
        <div className="space-y-4 md:space-y-6">
          {messages.map((msg) => {
            const isMe = msg.senderId === currentUser.id;

            if (msg.messageType === "QUOTATION" && msg.quotation) {
              return (
                <div key={msg.id} className={`flex ${isMe ? "justify-end" : ""}`}>
                  <div className="max-w-[400px]">
                    <QuotationMessage quotation={msg.quotation} messageId={msg.id} />
                  </div>
                </div>
              );
            }

            return (
              <div key={msg.id} className={`flex items-end gap-2 ${isMe ? "justify-end" : ""}`}>
                {!isMe && (
                  <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-indigo-200 text-xs font-bold text-blue-500 md:h-8 md:w-8 md:text-sm">
                    {msg.senderAvatar || msg.senderName?.charAt(0)}
                  </div>
                )}
                <div
                  className={`max-w-[280px] rounded-2xl p-2.5 text-sm md:max-w-md md:p-3 md:text-base ${
                    isMe ? "bg-primary text-white" : "bg-white"
                  }`}
                >
                  <p>{msg.content}</p>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(msg.createdAt).toLocaleTimeString("ko-KR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            );
          })}
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
          {currentUser.role === "driver" && (
            <button
              type="button"
              onClick={() => setIsQuotationModalOpen(true)}
              className="flex h-8 items-center justify-center rounded-full bg-green-500 px-4 text-sm font-medium text-white hover:bg-green-600 md:h-10 md:text-base"
            >
              💼 견적
            </button>
          )}
          <input
            type="text"
            placeholder="메시지를 입력하세요…"
            className="h-full flex-1 rounded-full bg-gray-100 px-3 text-sm outline-none md:px-4 md:text-base"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button
            type="submit"
            className="bg-primary flex h-8 w-16 items-center justify-center rounded-full text-sm font-medium text-white md:h-10 md:w-20 md:text-base"
          >
            전송
          </button>
        </form>
      </footer>

      {/* Quotation Modal */}
      <QuotationModal
        isOpen={isQuotationModalOpen}
        onClose={() => setIsQuotationModalOpen(false)}
        onSend={handleSendQuotation}
        initialRequestInfo={{
          serviceType: "HOME_MOVE",
          moveAt: "2025-10-30",
          departureAddress: "서울특별시 강남구 테헤란로 123",
          arrivalAddress: "서울특별시 송파구 중앙로 23",
          additionalRequirements: "사다리차 사용 불가",
        }}
      />
    </div>
  );
}
