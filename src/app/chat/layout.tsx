"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import useChatStore from "@/store/chatStore";
import { ChatRoomListItem } from "@/types/chat";
import { getMyChatRooms } from "@/lib/apis/chatApi";

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  const { connectSocket, disconnectSocket } = useChatStore();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [chatRooms, setChatRooms] = useState<ChatRoomListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 현재 채팅방에 있는지 확인 (모바일에서 sidebar 숨김용)
  const isInChatRoom = pathname !== "/chat";

  // 채팅방 목록을 불러오는 함수
  const fetchChatRooms = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const rooms = await getMyChatRooms();
      console.log("📋 채팅방 목록 로드:", rooms);
      setChatRooms(rooms);
    } catch (err) {
      const error = err as {
        response?: { status?: number; data?: { message?: string } };
        message?: string;
      };
      console.error("❌ 채팅방 목록 로드 실패:", error);

      // 401 에러면 인증 실패이므로 로그인 페이지로 리다이렉트
      if (error.response?.status === 401) {
        console.log("🔒 인증 필요 - 로그인 페이지로 이동");
        window.location.href = "/login";
        return;
      }

      setError(
        error.response?.data?.message || error.message || "채팅방 목록을 불러올 수 없습니다."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // WebSocket 연결
  useEffect(() => {
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000";
    connectSocket(socketUrl);

    return () => {
      disconnectSocket();
    };
  }, [connectSocket, disconnectSocket]);

  // 초기 채팅방 목록 로드
  useEffect(() => {
    fetchChatRooms();
  }, []);

  return (
    <>
      {/* Desktop Layout */}
      <div className="hidden h-[calc(100vh-64px)] md:flex">
        {/* Desktop Sidebar */}
        <aside className="w-80 border-r border-gray-200 bg-white p-4">
          <h2 className="mb-4 text-lg font-bold">대화 목록</h2>
          {isLoading ? (
            <div className="py-8 text-center text-sm text-gray-500">로딩 중...</div>
          ) : error ? (
            <div className="py-8 text-center text-sm text-red-500">{error}</div>
          ) : chatRooms.length === 0 ? (
            <div className="py-8 text-center text-sm text-gray-500">아직 채팅이 없습니다</div>
          ) : (
            <ul className="space-y-2">
              {chatRooms.map((room) => (
                <Link key={room.roomId} href={`/chat/${room.roomId}`}>
                  <li className="cursor-pointer rounded-lg p-3 transition-colors hover:bg-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-indigo-200 text-sm font-bold text-indigo-600">
                        {room.other.displayName.charAt(0)}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-semibold">{room.other.displayName}</p>
                        {room.lastMessage && (
                          <p className="mt-1 truncate text-xs text-gray-600">
                            {room.lastMessage.type === "QUOTATION"
                              ? "💼 견적서"
                              : room.lastMessage.content || "(내용 없음)"}
                          </p>
                        )}
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
                {isLoading ? (
                  <div className="py-8 text-center text-sm text-gray-500">로딩 중...</div>
                ) : error ? (
                  <div className="py-8 text-center text-sm text-red-500">{error}</div>
                ) : chatRooms.length === 0 ? (
                  <div className="py-8 text-center text-sm text-gray-500">아직 채팅이 없습니다</div>
                ) : (
                  <ul className="space-y-2">
                    {chatRooms.map((room) => (
                      <Link
                        key={room.roomId}
                        href={`/chat/${room.roomId}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <li className="cursor-pointer rounded-lg p-3 transition-colors hover:bg-gray-100">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-indigo-200 text-sm font-bold text-indigo-600">
                              {room.other.displayName.charAt(0)}
                            </div>
                            <div className="flex-1 overflow-hidden">
                              <p className="text-sm font-semibold">{room.other.displayName}</p>
                              {room.lastMessage && (
                                <p className="mt-1 truncate text-xs text-gray-600">
                                  {room.lastMessage.type === "QUOTATION"
                                    ? "💼 견적서"
                                    : room.lastMessage.content || "(내용 없음)"}
                                </p>
                              )}
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
