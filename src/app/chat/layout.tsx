"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import useChatStore from "@/store/chatStore";
import { ChatRoomListItem, WebSocketNewMessageData } from "@/types/chat";
import { getMyChatRooms } from "@/lib/apis/chatApi";

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  const { connectSocket, disconnectSocket, readRooms, socket, currentRoomId } = useChatStore();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [conversations, setConversations] = useState<ChatRoomListItem[]>([]);
  const [isLoadingRooms, setIsLoadingRooms] = useState(true);
  const [roomsError, setRoomsError] = useState<string | null>(null);

  // 현재 채팅방에 있는지 확인 (모바일에서 sidebar 숨김용)
  const isInChatRoom = pathname !== "/chat";

  // 채팅방 목록 로드
  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        setIsLoadingRooms(true);
        setRoomsError(null);
        const rooms = await getMyChatRooms();

        // readRooms에 있는 방은 unreadCount를 0으로 설정
        const adjustedRooms = rooms.map((room) => ({
          ...room,
          unreadCount: readRooms.has(room.roomId) ? 0 : room.unreadCount,
        }));

        setConversations(adjustedRooms);
      } catch (error) {
        const err = error as {
          response?: { status?: number; data?: { message?: string } };
          message?: string;
        };
        console.error("채팅방 목록 로드 실패:", error);

        // 401 에러면 인증 실패
        if (err.response?.status === 401) {
          setRoomsError("로그인이 필요합니다.");
        } else {
          setRoomsError(err.response?.data?.message || "채팅방 목록을 불러올 수 없습니다.");
        }
      } finally {
        setIsLoadingRooms(false);
      }
    };

    fetchChatRooms();
  }, []); // 최초 한 번만 API 호출

  // readRooms 변경 시 conversations 업데이트 (깜빡임 없이)
  useEffect(() => {
    setConversations((prev) =>
      prev.map((room) => ({
        ...room,
        unreadCount: readRooms.has(room.roomId) ? 0 : room.unreadCount,
      }))
    );
  }, [readRooms]);

  // WebSocket으로 실시간 대화 목록 업데이트
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (data: WebSocketNewMessageData) => {
      // 최신 상태를 직접 가져오기
      const latestCurrentRoomId = useChatStore.getState().currentRoomId;
      const latestReadRooms = useChatStore.getState().readRooms;

      // 대화 목록에서 해당 방 찾아서 업데이트
      setConversations((prev) => {
        const roomIndex = prev.findIndex((room) => room.roomId === data.roomId);

        if (roomIndex === -1) {
          console.warn("⚠️ 대화 목록에 없는 방:", data.roomId);
          return prev;
        }

        const newConversations = [...prev];
        const targetRoom = { ...newConversations[roomIndex] };
        const oldUnreadCount = targetRoom.unreadCount;

        // 마지막 메시지 업데이트
        targetRoom.lastMessage = {
          id: data.msg.id,
          type: data.msg.messageType,
          content: data.msg.body || "새 메시지",
          createdAt: data.msg.sentAt,
        };

        // unreadCount 증가 (현재 보고 있는 방이 아니면 증가)
        // 최신 상태 다시 가져오기 (클로저 문제 방지)
        const latestCurrentRoomId = useChatStore.getState().currentRoomId;
        const latestReadRooms = useChatStore.getState().readRooms;

        // currentRoomId가 null이면 어떤 방도 보고 있지 않은 상태 (/chat 페이지)
        const isCurrentRoom = latestCurrentRoomId !== null && data.roomId === latestCurrentRoomId;

        if (isCurrentRoom) {
          // 현재 보고 있는 방이면 unreadCount를 0으로
          targetRoom.unreadCount = 0;
        } else {
          // 다른 방에서 메시지가 오면 readRooms에서 제거하고 카운트 증가
          if (latestReadRooms.has(data.roomId)) {
            useChatStore.getState().unmarkRoomAsRead(data.roomId);
          }
          targetRoom.unreadCount = (targetRoom.unreadCount || 0) + 1;
        }

        // 해당 방을 맨 위로 이동
        newConversations.splice(roomIndex, 1);
        newConversations.unshift(targetRoom);

        return newConversations;
      });
    };

    socket.on("chat:new", handleNewMessage);

    return () => {
      socket.off("chat:new", handleNewMessage);
    };
  }, [socket]); // readRooms와 currentRoomId는 getState()로 직접 가져오므로 dependency 제거

  useEffect(() => {
    // TODO: .env 파일에 NEXT_PUBLIC_SOCKET_URL 설정 필요 (예: http://localhost:3001)
    const socketUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    connectSocket(socketUrl);

    // 컴포넌트가 언마운트될 때 소켓 연결 해제
    return () => {
      disconnectSocket();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 한 번만 실행

  return (
    <>
      {/* Desktop Layout */}
      <div className="hidden h-[calc(100vh-64px)] md:flex">
        {/* Desktop Sidebar */}
        <aside className="w-80 border-r border-gray-200 bg-white p-4">
          <h2 className="mb-4 text-lg font-bold">대화 목록</h2>
          {isLoadingRooms ? (
            <div className="py-8 text-center text-sm text-gray-500">로딩 중...</div>
          ) : roomsError ? (
            <div className="py-8 text-center text-sm text-red-500">{roomsError}</div>
          ) : conversations.length === 0 ? (
            <div className="py-8 text-center text-sm text-gray-500">아직 채팅이 없습니다</div>
          ) : (
            <ul className="space-y-2">
              {conversations.map((convo) => (
                <Link key={convo.roomId} href={`/chat/${convo.roomId}`}>
                  <li className="cursor-pointer rounded-lg p-3 transition-colors hover:bg-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-indigo-200 text-xs font-bold text-blue-500">
                        {convo.other.avatarUrl ? (
                          <img
                            src={convo.other.avatarUrl}
                            alt={convo.other.displayName}
                            className="h-full w-full rounded-full object-cover"
                          />
                        ) : (
                          convo.other.displayName.charAt(0)
                        )}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold">{convo.other.displayName}</p>
                          {convo.unreadCount > 0 && (
                            <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                              {convo.unreadCount}
                            </span>
                          )}
                        </div>
                        <p className="mt-1 truncate text-xs text-gray-600">
                          {convo.lastMessage?.type === "MESSAGE"
                            ? convo.lastMessage.content
                            : convo.lastMessage?.type === "QUOTATION"
                              ? "💼 견적서"
                              : "메시지가 없습니다"}
                        </p>
                      </div>
                    </div>
                  </li>
                </Link>
              ))}
            </ul>
          )}
        </aside>

        {/* Desktop Main Content */}
        <main className="flex-1 bg-gray-50">{children}</main>
      </div>

      {/* Mobile Layout */}
      <div className="relative h-[calc(100vh-64px)] md:hidden">
        {/* Mobile Main Content */}
        <main className="h-full bg-gray-50">
          {isInChatRoom && (
            <div className="flex h-14 items-center border-b border-gray-200 bg-white px-4">
              <button className="-ml-2 p-2" onClick={() => setIsMobileMenuOpen(true)}>
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
              <h1 className="ml-2 text-lg font-semibold">채팅</h1>
            </div>
          )}

          <div className={`${isInChatRoom ? "h-[calc(100%-3.5rem)]" : "h-full"}`}>{children}</div>
        </main>

        {/* Mobile Menu Modal */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50">
            {/* Backdrop */}
            <div
              className="bg-opacity-50 absolute inset-0 bg-black"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Menu Panel */}
            <div className="absolute top-0 bottom-0 left-0 w-80 bg-white shadow-xl">
              <div className="border-b border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-900">대화 목록</h2>
                  <button
                    className="-mr-2 rounded-lg p-2 transition-colors hover:bg-gray-100"
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-label="메뉴 닫기"
                  >
                    <svg
                      className="h-6 w-6 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="overflow-y-auto p-4">
                {isLoadingRooms ? (
                  <div className="py-8 text-center text-sm text-gray-500">로딩 중...</div>
                ) : roomsError ? (
                  <div className="py-8 text-center text-sm text-red-500">{roomsError}</div>
                ) : conversations.length === 0 ? (
                  <div className="py-8 text-center text-sm text-gray-500">아직 채팅이 없습니다</div>
                ) : (
                  <ul className="space-y-2">
                    {conversations.map((convo) => (
                      <Link
                        key={convo.roomId}
                        href={`/chat/${convo.roomId}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <li className="cursor-pointer rounded-lg p-3 transition-colors hover:bg-gray-100">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-indigo-200 text-xs font-bold text-indigo-600">
                              {convo.other.avatarUrl ? (
                                <img
                                  src={convo.other.avatarUrl}
                                  alt={convo.other.displayName}
                                  className="h-full w-full rounded-full object-cover"
                                />
                              ) : (
                                convo.other.displayName.charAt(0)
                              )}
                            </div>
                            <div className="flex-1 overflow-hidden">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-semibold">{convo.other.displayName}</p>
                                {convo.unreadCount > 0 && (
                                  <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                                    {convo.unreadCount}
                                  </span>
                                )}
                              </div>
                              <p className="mt-1 truncate text-xs text-gray-600">
                                {convo.lastMessage?.type === "MESSAGE"
                                  ? convo.lastMessage.content
                                  : convo.lastMessage?.type === "QUOTATION"
                                    ? "💼 견적서"
                                    : "메시지가 없습니다"}
                              </p>
                            </div>
                          </div>
                        </li>
                      </Link>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
