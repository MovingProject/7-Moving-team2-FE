"use client";

import QuotationMessage from "@/components/chat/QuotationMessage";
import QuotationModal from "@/components/chat/QuotationModal";
import { getChatMessages } from "@/lib/apis/chatApi";
import { getRequestById } from "@/services/requestService";
import { useAuthStore } from "@/store/authStore";
import useChatStore from "@/store/chatStore";
import { BackendChatMessage, Message, WebSocketNewMessageData } from "@/types/chat";
import { RequestDetail } from "@/types/request";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

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
  const [requestData, setRequestData] = useState<RequestDetail | null>(null);
  const [requestIdForRoom, setRequestIdForRoom] = useState<string | null>(null);
  const [otherUserName, setOtherUserName] = useState<string>("상대방");
  const [otherUserNickname, setOtherUserNickname] = useState<string | null>(null);
  const [otherUserImage, setOtherUserImage] = useState<string | null>(null);

  // 현재 사용자 정보
  const currentUser = user
    ? { id: user.id, name: user.name, role: user.role.toLowerCase() as "consumer" | "driver" }
    : { id: "", name: "게스트", role: "consumer" as const };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.body.style.scrollbarGutter = "stable";

    return () => {
      document.body.style.overflow = "";
      document.body.style.scrollbarGutter = "";
    };
  }, []);

  // 현재 사용자 정보를 chatStore에 설정
  useEffect(() => {
    if (user) {
      useChatStore.setState({
        currentUser: {
          id: user.id,
          name: user.name,
          role: user.role.toLowerCase() as "consumer" | "driver",
        },
      });
    }
  }, [user]);

  // 채팅방이 변경되면 currentRoomId 설정 및 상대방 정보 가져오기
  useEffect(() => {
    useChatStore.setState({ currentRoomId: resolvedParams.roomId });

    // 채팅방 목록에서 현재 방의 상대방 정보 가져오기
    const fetchOtherUserInfo = async () => {
      try {
        const { getMyChatRooms } = await import("@/lib/apis/chatApi");
        const rooms = await getMyChatRooms();
        const currentRoom = rooms.find((room) => room.roomId === resolvedParams.roomId);

        if (currentRoom && currentRoom.other) {
          setOtherUserName(currentRoom.other.name);
          setOtherUserNickname(currentRoom.other.displayName);
          setOtherUserImage(currentRoom.other.avatarUrl || null);
        }
      } catch (error) {}
    };

    fetchOtherUserInfo();
  }, [resolvedParams.roomId]);

  // 스크롤을 맨 아래로 이동시키는 함수
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // 마지막 QUOTATION 메시지(있으면)를 찾음 — requestData가 없을 때 재전송용으로 사용
  const lastQuotationMessage = [...messages]
    .slice()
    .reverse()
    .find((m) => m.messageType === "QUOTATION" && m.quotation);
  const hasLastQuotation = !!lastQuotationMessage;

  // 메시지 목록이 변경될 때마다 스크롤을 맨 아래로 이동
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // WebSocket 채팅방 입장 및 새 메시지 수신
  useEffect(() => {
    if (!socket) return;

    // 채팅방 입장
    socket.emit("chat:join", { roomId: resolvedParams.roomId });

    // 새 메시지 수신 이벤트 리스너
    const handleNewMessage = (data: WebSocketNewMessageData) => {
      if (data.roomId !== resolvedParams.roomId) return;

      // 중복 메시지 체크를 위해 최신 messages를 가져옴 (zustand에서 직접)
      const currentMessages = useChatStore.getState().messages;
      const { addMessage, replaceTempMessage } = useChatStore.getState();

      // 먼저 실제 ID로 중복 체크 (가장 중요!)
      if (currentMessages.some((msg) => msg.id === data.msg.id)) {
        return;
      }

      // 내가 보낸 메시지인 경우
      if (data.msg.authorId === currentUser.id) {
        // tempId가 있으면 교체
        if (data.msg.tempId) {
          const tempMsg = currentMessages.find((msg) => msg.id === data.msg.tempId);
          if (tempMsg) {
            // QUOTATION 타입인 경우 전체 메시지 새로고침
            if (data.msg.messageType === "QUOTATION") {
              setTimeout(async () => {
                try {
                  const response = await getChatMessages(resolvedParams.roomId, undefined, 30);
                  const formattedMessages: Message[] = response.messages.map(
                    (msg: BackendChatMessage) => ({
                      id: msg.id,
                      chattingRoomId: msg.chattingRoomId,
                      senderId: msg.senderId,
                      senderName: msg.isMine ? currentUser.name : "상대방",
                      senderAvatar: msg.isMine ? currentUser.name.charAt(0) : "상",
                      messageType: msg.messageType,
                      content: msg.content,
                      createdAt: msg.createdAt,
                      quotation: msg.quotation ? { ...msg.quotation } : undefined,
                    })
                  );
                  setMessages(formattedMessages);
                } catch (error) {}
              }, 500);
              return;
            }

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
            return;
          }
        }

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

      // QUOTATION 타입인 경우 전체 메시지를 다시 불러와서 최신 데이터 반영
      if (data.msg.messageType === "QUOTATION" && data.msg.quotationId) {
        // 잠시 후 메시지 목록 새로고침 (DB에서 전체 quotation 데이터 포함)
        setTimeout(async () => {
          try {
            const response = await getChatMessages(resolvedParams.roomId, undefined, 30);
            const formattedMessages: Message[] = response.messages.map(
              (msg: BackendChatMessage) => ({
                id: msg.id,
                chattingRoomId: msg.chattingRoomId,
                senderId: msg.senderId,
                senderName: msg.isMine ? currentUser.name : "상대방",
                senderAvatar: msg.isMine ? currentUser.name.charAt(0) : "상",
                messageType: msg.messageType,
                content: msg.content,
                createdAt: msg.createdAt,
                quotation: msg.quotation ? { ...msg.quotation } : undefined,
              })
            );
            setMessages(formattedMessages);
          } catch (error) {}
        }, 500);
        return; // 임시 메시지 추가하지 않고 새로고침으로 처리
      }

      // 견적 수락 특수 메시지 체크
      if (newMsg.content?.startsWith("__QUOTATION_ACCEPTED__:")) {
        const [, quotationId, targetMessageId] = newMsg.content.split(":");

        // 해당 견적 메시지 상태 업데이트
        const { updateMessage: updateMsg } = useChatStore.getState();
        const currentMessages = useChatStore.getState().messages;
        const targetMessage = currentMessages.find((msg) => msg.id === targetMessageId);

        if (targetMessage && targetMessage.quotation) {
          updateMsg(targetMessageId, {
            quotation: { ...targetMessage.quotation, status: "CONCLUDED" },
          });
        }
        // 특수 메시지는 채팅에 표시하지 않음
        return;
      }

      addMessage(newMsg);

      // 상대방 메시지를 받으면 즉시 읽음 처리
      if (socket) {
        socket.emit(
          "chat:read",
          {
            roomId: data.roomId,
            lastReadMessageId: newMsg.id,
          },
          (response: { ok: boolean; data?: unknown }) => {
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
      socket.off("chat:new", handleNewMessage);
    };
  }, [socket, resolvedParams.roomId, currentUser.id, currentUser.name]);

  // requestId로 request 상세 정보 가져오기
  useEffect(() => {
    const fetchRequestData = async () => {
      if (!requestIdForRoom) {
        return;
      }

      try {
        const data = await getRequestById(requestIdForRoom);
        setRequestData(data);
      } catch (error: unknown) {
        // 404 에러는 정상적인 상황 (Request가 삭제되었거나 없음)
        const err = error as { response?: { status?: number } };
        if (err?.response?.status === 404) {
        } else {
        }
      }
    };

    fetchRequestData();
  }, [requestIdForRoom, resolvedParams.roomId]);

  // 채팅방에 처음 입장했을 때, 기존 메시지 불러오기
  useEffect(() => {
    const fetchMessages = async () => {
      if (!resolvedParams.roomId) {
        setError("채팅방 ID가 없습니다.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        // 최초 로드: 30개만 가져오기
        const response = await getChatMessages(resolvedParams.roomId, undefined, 30);

        // requestId 저장 (메시지 조회 응답에서 직접 받음)
        if (response.requestId) {
          setRequestIdForRoom(response.requestId);
        }

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
          quotation: msg.quotation ? { ...msg.quotation } : undefined, // quotation을 복사해서 사용
        }));

        // DB에서 받은 최신 데이터로 설정 (캐시도 함께 업데이트됨)
        setMessages(formattedMessages);

        // 초기 로드 후 맨 아래로 스크롤 + 스크롤 완료 후 isInitialLoad 해제
        setTimeout(() => {
          scrollToBottom();
          // 스크롤 애니메이션이 완료될 때까지 충분히 대기
          setTimeout(() => {
            setIsInitialLoad(false);
          }, 500);
        }, 100);

        // 메시지가 있으면 마지막 메시지를 읽음 처리
        if (socket && formattedMessages.length > 0) {
          const lastMessage = formattedMessages[formattedMessages.length - 1];
          socket.emit(
            "chat:read",
            {
              roomId: resolvedParams.roomId,
              lastReadMessageId: lastMessage.id,
            },
            (response: { ok: boolean; data?: unknown }) => {
              if (response?.ok) {
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
      setIsLoadingMore(true);

      try {
        const response = await getChatMessages(resolvedParams.roomId, nextCursor, 30);

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
          quotation: msg.quotation ? { ...msg.quotation } : undefined, // quotation을 복사해서 사용
        }));

        // 스크롤 위치 저장
        const prevScrollHeight = messageListRef.current?.scrollHeight || 0;

        // 중복 제거하면서 기존 메시지 앞에 추가
        const existingIds = new Set(messages.map((m) => m.id));
        const uniqueNewMessages = formattedMessages.filter((msg) => !existingIds.has(msg.id));

        setMessages([...uniqueNewMessages, ...messages]);
        const newCursor = response.pageInfo?.nextCursor || null;
        setNextCursor(newCursor);

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
        status: "PENDING",
        createdAt: new Date().toISOString(),
        chattingMessageId: tempId,
      },
    });
  };
  const isDriver = currentUser.role === "driver";
  const isFirstMessage = messages.length === 0;

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
          {!isLoading && messages.length === 0 && currentUser.role === "driver" && (
            <div className="flex h-full items-center justify-center py-3">
              <div className="rounded-xl bg-white p-4 text-center shadow md:p-6">
                <p className="text-sm font-semibold text-gray-800 md:text-base">
                  채팅방이 개설되었습니다.
                </p>
                <p className="mt-2 text-xs text-gray-500 md:text-sm">
                  첫 채팅은 견적서로만 시작할 수 있습니다.
                  <br />
                  아래 <span className="font-semibold">💼 견적</span> 버튼을 눌러 견적서를 먼저
                  전송해 주세요.
                </p>
              </div>
            </div>
          )}
          {messages.map((msg) => {
            const isMe = msg.senderId === currentUser.id;

            if (msg.messageType === "QUOTATION" && msg.quotation) {
              return (
                <div key={msg.id} className={`flex ${isMe ? "justify-end" : ""}`}>
                  <div className="max-w-[400px]">
                    <QuotationMessage
                      quotation={msg.quotation}
                      messageId={msg.id}
                      otherUserName={otherUserName}
                      otherUserNickname={otherUserNickname}
                    />
                  </div>
                </div>
              );
            }

            return (
              <div key={msg.id} className={`flex items-end gap-2 ${isMe ? "justify-end" : ""}`}>
                {!isMe &&
                  (otherUserImage ? (
                    <Image
                      src={otherUserImage}
                      alt={otherUserName}
                      width={32}
                      height={32}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-indigo-200 text-sm font-bold text-blue-500">
                      {msg.senderName?.charAt(0) || "상"}
                    </div>
                  ))}
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
              onClick={() => {
                if (!requestData && !hasLastQuotation) {
                  alert("견적 요청서 정보를 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
                  return;
                }
                setIsQuotationModalOpen(true);
              }}
              disabled={!(requestData || hasLastQuotation)}
              className={`flex h-8 items-center justify-center rounded-full px-4 text-sm font-medium text-white md:h-10 md:text-base ${
                requestData || hasLastQuotation
                  ? "bg-green-500 hover:bg-green-600"
                  : "cursor-not-allowed bg-gray-400"
              }`}
              title={
                !requestData && !hasLastQuotation
                  ? "견적 요청서 정보를 불러오는 중..."
                  : "견적서 보내기"
              }
            >
              💼 견적
            </button>
          )}
          <input
            type="text"
            placeholder={
              isDriver && isFirstMessage
                ? "첫 메시지는 견적서만 전송할 수 있습니다."
                : "메시지를 입력하세요…"
            }
            className="h-full flex-1 rounded-full bg-gray-100 px-3 text-sm outline-none md:px-4 md:text-base"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button
            type="submit"
            className="bg-primary flex h-8 w-16 items-center justify-center rounded-full text-sm font-medium text-white md:h-10 md:w-20 md:text-base"
            disabled={isFirstMessage}
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
        // requestData 우선, 없으면 마지막 QUOTATION 메시지에서 requestInfo를 채움
        initialRequestInfo={
          requestData
            ? {
                serviceType: requestData.serviceType || "HOME_MOVE",
                moveAt: requestData.moveAt.split("T")[0], // ISO -> YYYY-MM-DD 변환
                departureAddress: requestData.departureAddress,
                departureFloor: requestData.departureFloor ?? 0,
                departurePyeong: requestData.departurePyeong ?? 0,
                departureElevator: requestData.departureElevator,
                arrivalAddress: requestData.arrivalAddress,
                arrivalFloor: requestData.arrivalFloor ?? 0,
                arrivalPyeong: requestData.arrivalPyeong ?? 0,
                arrivalElevator: requestData.arrivalElevator,
                additionalRequirements: requestData.additionalRequirements || undefined,
              }
            : lastQuotationMessage?.quotation
              ? {
                  serviceType: lastQuotationMessage.quotation.serviceType || "HOME_MOVE",
                  moveAt: lastQuotationMessage.quotation.moveAt
                    ? lastQuotationMessage.quotation.moveAt.split("T")[0]
                    : new Date().toISOString().split("T")[0],
                  departureAddress: lastQuotationMessage.quotation.departureAddress || "",
                  departureFloor: lastQuotationMessage.quotation.departureFloor ?? 0,
                  departurePyeong: lastQuotationMessage.quotation.departurePyeong ?? 0,
                  departureElevator: lastQuotationMessage.quotation.departureElevator ?? false,
                  arrivalAddress: lastQuotationMessage.quotation.arrivalAddress || "",
                  arrivalFloor: lastQuotationMessage.quotation.arrivalFloor ?? 0,
                  arrivalPyeong: lastQuotationMessage.quotation.arrivalPyeong ?? 0,
                  arrivalElevator: lastQuotationMessage.quotation.arrivalElevator ?? false,
                  additionalRequirements:
                    lastQuotationMessage.quotation.additionalRequirements || undefined,
                }
              : {
                  // 데이터 로딩 중일 때 기본값
                  serviceType: "HOME_MOVE",
                  moveAt: new Date().toISOString().split("T")[0],
                  departureAddress: "",
                  departureFloor: 0,
                  departurePyeong: 0,
                  departureElevator: false,
                  arrivalAddress: "",
                  arrivalFloor: 0,
                  arrivalPyeong: 0,
                  arrivalElevator: false,
                }
        }
        // 마지막 견적에서 금액/메시지 프리필 전달
        initialPrice={lastQuotationMessage?.quotation?.price}
        initialMessage={lastQuotationMessage?.content || ""}
      />
    </div>
  );
}
