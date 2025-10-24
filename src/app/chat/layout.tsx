"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import useChatStore from "@/store/chatStore";
import { conversations, messagesByRoomId } from "./mock/data";

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  const { connectSocket, disconnectSocket } = useChatStore();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 현재 채팅방에 있는지 확인 (모바일에서 sidebar 숨김용)
  const isInChatRoom = pathname !== "/chat";

  useEffect(() => {
    // TODO: .env 파일에 NEXT_PUBLIC_SOCKET_URL 설정 필요 (예: http://localhost:3001)
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001";
    connectSocket(socketUrl);

    // 컴포넌트가 언마운트될 때 소켓 연결 해제
    return () => {
      disconnectSocket();
    };
  }, [connectSocket, disconnectSocket]);

  return (
    <>
      {/* Desktop Layout */}
      <div className="hidden h-[calc(100vh-64px)] md:flex">
        {/* Desktop Sidebar */}
        <aside className="w-80 border-r border-gray-200 bg-white p-4">
          <h2 className="mb-4 text-lg font-bold">대화 목록</h2>
          <ul className="space-y-2">
            {conversations.map((convo) => {
              const roomMessages = messagesByRoomId[convo.id] || [];
              const lastMsg = roomMessages.length
                ? roomMessages[roomMessages.length - 1]
                : undefined;
              const avatarText =
                lastMsg?.senderAvatar ?? lastMsg?.senderName?.charAt(0) ?? convo.name.charAt(0);

              return (
                <Link key={convo.id} href={`/chat/${convo.id}`}>
                  <li className="cursor-pointer rounded-lg p-3 transition-colors hover:bg-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-indigo-200 text-xs font-bold text-blue-500 md:h-8 md:w-8 md:text-sm">
                        {avatarText}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{convo.name}</p>
                        <p className="mt-1 truncate text-xs text-gray-600">{convo.lastMessage}</p>
                      </div>
                    </div>
                  </li>
                </Link>
              );
            })}
          </ul>
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
                <ul className="space-y-2">
                  {conversations.map((convo) => {
                    const roomMessages = messagesByRoomId[convo.id] || [];
                    const lastMsg = roomMessages.length
                      ? roomMessages[roomMessages.length - 1]
                      : undefined;
                    const avatarText =
                      lastMsg?.senderAvatar ??
                      lastMsg?.senderName?.charAt(0) ??
                      convo.name.charAt(0);

                    return (
                      <Link
                        key={convo.id}
                        href={`/chat/${convo.id}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <li className="cursor-pointer rounded-lg p-3 transition-colors hover:bg-gray-100">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-indigo-200 text-xs font-bold text-indigo-600 md:h-8 md:w-8 md:text-sm">
                              {avatarText}
                            </div>
                            <div>
                              <p className="text-sm font-semibold">{convo.name}</p>
                              <p className="mt-1 truncate text-xs text-gray-600">
                                {convo.lastMessage}
                              </p>
                            </div>
                          </div>
                        </li>
                      </Link>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
