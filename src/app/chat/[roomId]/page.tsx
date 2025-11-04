"use client";

import React, { useState, useEffect, useRef } from "react";
import useChatStore from "@/store/chatStore";
import { useAuthStore } from "@/store/authStore";
import QuotationModal from "@/components/chat/QuotationModal";
import QuotationMessage from "@/components/chat/QuotationMessage";
import { getChatMessages } from "@/lib/apis/chatApi";
import { WebSocketNewMessageData, BackendChatMessage, Message } from "@/types/chat";

// 이 페이지는 클라이언트 측에서 동적으로 렌더링됩니다.
export default function ChatRoomPage({ params }: { params: Promise<{ roomId: string }> }) {
  const resolvedParams = React.use(params);
  const {
    socket,
    messages,
    addMessage,
    setMessages,
    replaceTempMessage,
    markRoomAsRead,
    setCurrentRoom,
  } = useChatStore();
  const { user } = useAuthStore();
  const [newMessage, setNewMessage] = useState("");
  const [isQuotationModalOpen, setIsQuotationModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const messageListRef = useRef<HTMLDivElement>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // 현재 사용자 정보
  const currentUser = user
    ? { id: user.id, name: user.name, role: user.role.toLowerCase() as "consumer" | "driver" }
    : { id: "", name: "게스트", role: "consumer" as const };

  // 채팅방이 변경되면 currentRoomId 설정
  useEffect(() => {
    console.log("🔄 채팅방 변경:", resolvedParams.roomId);
    useChatStore.setState({ currentRoomId: resolvedParams.roomId });
  }, [resolvedParams.roomId]);

  // 스크롤을 맨 아래로 이동시키는 함수
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // 메시지 목록이 변경될 때마다 스크롤을 맨 아래로 이동
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // WebSocket 채팅방 입장 및 새 메시지 수신
  useEffect(() => {
    if (!socket) return;

    console.log("🔌 WebSocket 이벤트 리스너 등록");

    // 채팅방 입장
    socket.emit("chat:join", { roomId: resolvedParams.roomId });

    // 새 메시지 수신 이벤트 리스너
    const handleNewMessage = (data: WebSocketNewMessageData) => {
      console.log("📨 chat:new 이벤트 수신:", data);

      if (data.roomId !== resolvedParams.roomId) return;

      // 중복 메시지 체크를 위해 최신 messages를 가져옴 (zustand에서 직접)
      const currentMessages = useChatStore.getState().messages;
      const { addMessage, replaceTempMessage } = useChatStore.getState();

      // 먼저 실제 ID로 중복 체크 (가장 중요!)
      if (currentMessages.some((msg) => msg.id === data.msg.id)) {
        console.log("⚠️ 중복 메시지 무시 (이미 존재하는 ID):", data.msg.id);
        return;
      }

      // 내가 보낸 메시지인 경우
      if (data.msg.authorId === currentUser.id) {
        console.log("💬 내가 보낸 메시지 수신 확인");

        // tempId가 있으면 교체
        if (data.msg.tempId) {
          const tempMsg = currentMessages.find((msg) => msg.id === data.msg.tempId);
          if (tempMsg) {
            console.log("🔄 tempId 교체:", data.msg.tempId, "→", data.msg.id);
            const newMsg: Message = {
              id: data.msg.id,
              chattingRoomId: data.roomId,
              senderId: data.msg.authorId,
              senderName: currentUser.name,
              senderAvatar: currentUser.name.charAt(0),
              messageType: data.msg.messageType,
              content: data.msg.messageType === "MESSAGE" ? data.msg.body || null : null,
              createdAt: data.msg.sentAt,
            };
            replaceTempMessage(data.msg.tempId, newMsg);
            return;
          } else {
            console.log("⚠️ tempId를 찾을 수 없음, 무시:", data.msg.tempId);
            return;
          }
        }

        console.log("⚠️ 내가 보낸 메시지 (tempId 없음), 무시:", data.msg.id);
        return;
      }

      // 상대방 메시지 추가
      const newMsg: Message = {
        id: data.msg.id,
        chattingRoomId: data.roomId,
        senderId: data.msg.authorId,
        senderName: "상대방",
        senderAvatar: "상",
        messageType: data.msg.messageType,
        content: data.msg.messageType === "MESSAGE" ? data.msg.body || null : null,
        createdAt: data.msg.sentAt,
      };

      // QUOTATION 타입은 quotationId만 받으므로 임시로 처리 (Message 타입과 호환되도록)
      if (data.msg.messageType === "QUOTATION" && data.msg.quotationId) {
        newMsg.quotation = {
          id: data.msg.quotationId,
          consumerId: "",
          driverId: "",
          chattingRoomId: data.roomId,
          requestId: "",
          serviceType: "",
          moveAt: "",
          departureAddress: "",
          departureFloor: 0,
          departurePyeong: 0,
          departureElevator: false,
          arrivalAddress: "",
          arrivalFloor: 0,
          arrivalPyeong: 0,
          arrivalElevator: false,
          price: 0,
          status: "SUBMITTED",
          createdAt: data.msg.sentAt,
          chattingMessageId: data.msg.id,
        };
      }

      console.log("➕ 상대방 메시지 추가:", newMsg.id);
      addMessage(newMsg);

      // 상대방 메시지를 받으면 즉시 읽음 처리
      if (socket) {
        console.log("📖 새 메시지 읽음 처리 요청:", newMsg.id);
        socket.emit(
          "chat:read",
          {
            roomId: data.roomId,
            lastReadMessageId: newMsg.id,
          },
          (response: { ok: boolean; data?: unknown }) => {
            console.log("📖 새 메시지 읽음 처리 응답:", response);
            if (response?.ok) {
              // 즉시 읽음으로 표시 (UI 즉시 반영)
              markRoomAsRead(data.roomId);
            }
          }
        );
      }
    };

    socket.on("chat:new", handleNewMessage);

    return () => {
      console.log("🧹 chat:new 이벤트 리스너 제거");
      socket.off("chat:new", handleNewMessage);
    };
  }, [socket, resolvedParams.roomId, currentUser.id, currentUser.name]);

  // 채팅방에 처음 입장했을 때, 기존 메시지 불러오기
  useEffect(() => {
    const fetchMessages = async () => {
      console.log("🔍 Fetching messages for roomId:", resolvedParams.roomId);

      if (!resolvedParams.roomId) {
        console.error("❌ roomId가 undefined입니다!");
        setError("채팅방 ID가 없습니다.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        // 최초 로드: 30개만 가져오기
        const response = await getChatMessages(resolvedParams.roomId, undefined, 30);

        console.log("📦 API 응답:", {
          total: response.messages.length,
          first: response.messages[0]?.content,
          last: response.messages[response.messages.length - 1]?.content,
          lastId: response.messages[response.messages.length - 1]?.id,
          nextCursor: response.pageInfo?.nextCursor,
        });

        // 다음 페이지 커서 저장
        setNextCursor(response.pageInfo?.nextCursor || null);

        // 백엔드 응답을 프론트엔드 형식으로 변환
        const formattedMessages: Message[] = response.messages.map((msg: BackendChatMessage) => ({
          id: msg.id,
          chattingRoomId: msg.chattingRoomId,
          senderId: msg.senderId,
          senderName: msg.isMine ? currentUser.name : "상대방",
          senderAvatar: msg.isMine ? currentUser.name.charAt(0) : "상",
          messageType: msg.messageType,
          content: msg.content,
          createdAt: msg.createdAt,
          quotation: msg.quotation
            ? {
                id: msg.quotation.id,
                consumerId: "",
                driverId: "",
                chattingRoomId: msg.chattingRoomId,
                requestId: "",
                serviceType: "",
                moveAt: msg.quotation.moveAt,
                departureAddress: msg.quotation.departureAddress,
                departureFloor: 0,
                departurePyeong: 0,
                departureElevator: false,
                arrivalAddress: msg.quotation.arrivalAddress,
                arrivalFloor: 0,
                arrivalPyeong: 0,
                arrivalElevator: false,
                price: msg.quotation.price,
                status: "SUBMITTED",
                createdAt: msg.createdAt,
                chattingMessageId: msg.id,
              }
            : undefined,
        }));

        // DB에서 받은 최신 데이터로 설정 (캐시도 함께 업데이트됨)
        setMessages(formattedMessages);
        console.log("✅ DB에서 메시지 로드 완료:", {
          count: formattedMessages.length,
          lastContent: formattedMessages[formattedMessages.length - 1]?.content,
          lastId: formattedMessages[formattedMessages.length - 1]?.id,
        });

        // 초기 로드 후 맨 아래로 스크롤 + 스크롤 완료 후 isInitialLoad 해제
        setTimeout(() => {
          scrollToBottom();
          // 스크롤 애니메이션이 완료될 때까지 충분히 대기
          setTimeout(() => {
            setIsInitialLoad(false);
            console.log("✅ 초기 로드 완료 - 무한 스크롤 활성화");
          }, 500);
        }, 100);

        // 메시지가 있으면 마지막 메시지를 읽음 처리
        if (socket && formattedMessages.length > 0) {
          const lastMessage = formattedMessages[formattedMessages.length - 1];
          console.log("📖 채팅방 입장 - 읽음 처리 요청:", {
            roomId: resolvedParams.roomId,
            lastMessageId: lastMessage.id,
          });

          socket.emit(
            "chat:read",
            {
              roomId: resolvedParams.roomId,
              lastReadMessageId: lastMessage.id,
            },
            (response: { ok: boolean; data?: unknown }) => {
              console.log("📖 읽음 처리 응답:", response);
              if (response?.ok) {
                console.log("✅ 읽음 처리 성공!");
                // 즉시 읽음으로 표시 (UI 즉시 반영)
                markRoomAsRead(resolvedParams.roomId);
              } else {
                console.error("❌ 읽음 처리 실패:", response);
              }
            }
          );
        }
      } catch (error) {
        const err = error as {
          response?: { status?: number; statusText?: string; data?: { message?: string } };
          message?: string;
        };
        console.error("❌ 메시지 로딩 실패:", error);
        console.error("Error details:", {
          status: err.response?.status,
          statusText: err.response?.statusText,
          data: err.response?.data,
          message: err.message,
        });

        // 401 에러면 인증 실패이므로 로그인 페이지로 리다이렉트
        if (err.response?.status === 401) {
          console.log("🔒 인증 필요 - 로그인 페이지로 이동");
          window.location.href = "/login";
          return;
        }

        const errorMessage =
          err.response?.data?.message || err.message || "메시지를 불러올 수 없습니다.";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [resolvedParams.roomId, currentUser.name]);

  // 스크롤이 맨 위에 도달하면 과거 메시지 불러오기
  const handleScroll = async () => {
    if (!messageListRef.current || isLoadingMore || isInitialLoad) return;

    const { scrollTop } = messageListRef.current;

    // nextCursor가 없으면 더 이상 불러올 데이터 없음
    if (!nextCursor) {
      return;
    }

    // 스크롤이 맨 위에 도달했을 때 (50px 여유)
    if (scrollTop < 50) {
      console.log("📜 스크롤 맨 위 도달 - 과거 메시지 로드", {
        scrollTop,
        nextCursor,
        isLoadingMore,
      });
      setIsLoadingMore(true);

      try {
        const response = await getChatMessages(resolvedParams.roomId, nextCursor, 30);

        console.log("📦 추가 메시지 로드:", {
          count: response.messages.length,
          nextCursor: response.pageInfo?.nextCursor,
        });

        // 기존 메시지 앞에 과거 메시지 추가
        const formattedMessages: Message[] = response.messages.map((msg: BackendChatMessage) => ({
          id: msg.id,
          chattingRoomId: msg.chattingRoomId,
          senderId: msg.senderId,
          senderName: msg.isMine ? currentUser.name : "상대방",
          senderAvatar: msg.isMine ? currentUser.name.charAt(0) : "상",
          messageType: msg.messageType,
          content: msg.content,
          createdAt: msg.createdAt,
          quotation: msg.quotation
            ? {
                id: msg.quotation.id,
                consumerId: "",
                driverId: "",
                chattingRoomId: msg.chattingRoomId,
                requestId: "",
                serviceType: "",
                moveAt: msg.quotation.moveAt,
                departureAddress: msg.quotation.departureAddress,
                departureFloor: 0,
                departurePyeong: 0,
                departureElevator: false,
                arrivalAddress: msg.quotation.arrivalAddress,
                arrivalFloor: 0,
                arrivalPyeong: 0,
                arrivalElevator: false,
                price: msg.quotation.price,
                status: "SUBMITTED",
                createdAt: msg.createdAt,
                chattingMessageId: msg.id,
              }
            : undefined,
        }));

        // 스크롤 위치 저장
        const prevScrollHeight = messageListRef.current?.scrollHeight || 0;

        // 중복 제거하면서 기존 메시지 앞에 추가
        const existingIds = new Set(messages.map((m) => m.id));
        const uniqueNewMessages = formattedMessages.filter((msg) => !existingIds.has(msg.id));

        console.log("🔄 메시지 병합:", {
          새로운: formattedMessages.length,
          기존: messages.length,
          중복제거후: uniqueNewMessages.length,
        });

        setMessages([...uniqueNewMessages, ...messages]);
        const newCursor = response.pageInfo?.nextCursor || null;
        setNextCursor(newCursor);

        console.log("✅ 과거 메시지 로드 완료:", {
          추가됨: uniqueNewMessages.length,
          다음커서: newCursor,
        });

        // 스크롤 위치 복원 (새로 추가된 메시지만큼 아래로)
        setTimeout(() => {
          if (messageListRef.current) {
            const newScrollHeight = messageListRef.current.scrollHeight;
            messageListRef.current.scrollTop = newScrollHeight - prevScrollHeight;
          }
        }, 0);
      } catch (error) {
        console.error("❌ 과거 메시지 로드 실패:", error);
      } finally {
        setIsLoadingMore(false);
      }
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !socket) return;

    const tempId = `temp-${Date.now()}`;
    const messagePayload = {
      roomId: resolvedParams.roomId,
      tempId,
      messageType: "MESSAGE" as const,
      content: newMessage.trim(),
    };

    // 서버로 메시지 전송
    socket.emit("chat:send", messagePayload);

    // 낙관적 업데이트: 내가 보낸 메시지를 바로 UI에 추가
    addMessage({
      id: tempId,
      chattingRoomId: resolvedParams.roomId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.name.charAt(0),
      messageType: "MESSAGE",
      content: newMessage,
      createdAt: new Date().toISOString(),
    });

    setNewMessage("");
  };

  const handleSendQuotation = (
    price: number,
    message: string,
    requestInfo: {
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
      previousQuotationId?: string;
      validUntil?: string;
    }
  ) => {
    if (!socket) return;

    const tempId = `temp-${Date.now()}`;

    // 백엔드 WebSocket chat:send 이벤트로 견적 전송
    const quotationPayload = {
      roomId: resolvedParams.roomId,
      tempId,
      messageType: "QUOTATION" as const,
      quotation: {
        serviceType: requestInfo.serviceType,
        moveAt: new Date(requestInfo.moveAt).toISOString(),
        departureAddress: requestInfo.departureAddress,
        departureFloor: requestInfo.departureFloor,
        departurePyeong: requestInfo.departurePyeong,
        departureElevator: requestInfo.departureElevator,
        arrivalAddress: requestInfo.arrivalAddress,
        arrivalFloor: requestInfo.arrivalFloor,
        arrivalPyeong: requestInfo.arrivalPyeong,
        arrivalElevator: requestInfo.arrivalElevator,
        additionalRequirements: requestInfo.additionalRequirements || undefined,
        price: price,
        previousQuotationId: requestInfo.previousQuotationId,
        validUntil: requestInfo.validUntil
          ? new Date(requestInfo.validUntil).toISOString()
          : undefined,
      },
    };

    console.log("💼 견적 전송:", quotationPayload);
    socket.emit("chat:send", quotationPayload);

    // 낙관적 업데이트: 견적 메시지 즉시 UI에 추가
    addMessage({
      id: tempId,
      chattingRoomId: resolvedParams.roomId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.name.charAt(0),
      messageType: "QUOTATION",
      createdAt: new Date().toISOString(),
      quotation: {
        id: `temp-quot-${Date.now()}`,
        consumerId: "",
        driverId: "",
        chattingRoomId: resolvedParams.roomId,
        requestId: "",
        serviceType: requestInfo.serviceType,
        moveAt: requestInfo.moveAt,
        departureAddress: requestInfo.departureAddress,
        departureFloor: requestInfo.departureFloor,
        departurePyeong: requestInfo.departurePyeong,
        departureElevator: requestInfo.departureElevator,
        arrivalAddress: requestInfo.arrivalAddress,
        arrivalFloor: requestInfo.arrivalFloor,
        arrivalPyeong: requestInfo.arrivalPyeong,
        arrivalElevator: requestInfo.arrivalElevator,
        additionalRequirements: requestInfo.additionalRequirements,
        price: price,
        status: "SUBMITTED",
        createdAt: new Date().toISOString(),
        chattingMessageId: tempId,
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-gray-500">메시지를 불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4">
        <p className="text-red-500">❌ {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* Chat Header - 데스크톱에서만 표시 */}
      <header className="hidden h-16 items-center border-b border-gray-200 bg-white p-4 md:flex">
        <h2 className="text-lg font-bold">채팅</h2>
        <div className="ml-auto">
          <span className="text-sm text-gray-600">{currentUser.name}</span>
        </div>
      </header>

      {/* Message List */}
      <div
        ref={messageListRef}
        className="flex-1 overflow-y-auto bg-gray-100 p-3 md:p-6"
        onScroll={handleScroll}
      >
        {isLoadingMore && (
          <div className="py-2 text-center text-sm text-gray-500">과거 메시지 로딩 중...</div>
        )}
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
          moveAt: "2025-12-05",
          departureAddress: "서울특별시 강남구 테헤란로 123",
          departureFloor: 3,
          departurePyeong: 20,
          departureElevator: true,
          arrivalAddress: "서울특별시 송파구 중앙로 23",
          arrivalFloor: 5,
          arrivalPyeong: 25,
          arrivalElevator: false,
          additionalRequirements: "사다리차 사용 불가",
        }}
      />
    </div>
  );
}
