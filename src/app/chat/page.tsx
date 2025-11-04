"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChatRoomListItem } from "@/types/chat";
import { getMyChatRooms } from "@/lib/apis/chatApi";
import useChatStore from "@/store/chatStore";

export default function ChatHomePage() {
  const [conversations, setConversations] = useState<ChatRoomListItem[]>([]);
  const [isLoadingRooms, setIsLoadingRooms] = useState(true);
  const [roomsError, setRoomsError] = useState<string | null>(null);

  // /chat 페이지에서는 currentRoomId를 null로 설정
  useEffect(() => {
    useChatStore.setState({ currentRoomId: null });
  }, []);

  // 채팅방 목록 로드
  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        setIsLoadingRooms(true);
        setRoomsError(null);
        const rooms = await getMyChatRooms();
        setConversations(rooms);
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
  }, []);

  return (
    <div className="h-full bg-gray-50">
      {/* 데스크톱: 기존 빈 화면 */}
      <div className="hidden h-full items-center justify-center p-4 md:flex">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-200">
            <svg
              className="h-8 w-8 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <h3 className="mb-2 text-xl font-semibold text-gray-900">채팅방을 선택해주세요</h3>
          <p className="text-base text-gray-500">
            왼쪽 목록에서 대화하고 싶은 채팅방을 클릭하세요.
          </p>
        </div>
      </div>

      {/* 모바일: 채팅방 목록 표시 */}
      <div className="h-full md:hidden">
        {/* 헤더 */}
        <div className="border-b border-gray-200 bg-white p-4">
          <h1 className="text-xl font-bold text-gray-900">채팅</h1>
          <p className="mt-1 text-sm text-gray-600">대화 목록</p>
        </div>

        {/* 채팅방 목록 */}
        <div className="p-4">
          {isLoadingRooms ? (
            <div className="py-12 text-center">
              <p className="text-gray-500">로딩 중...</p>
            </div>
          ) : roomsError ? (
            <div className="py-12 text-center">
              <p className="text-red-500">{roomsError}</p>
            </div>
          ) : conversations.length === 0 ? (
            <div className="py-12 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-200">
                <svg
                  className="h-6 w-6 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <p className="text-gray-500">아직 채팅이 없습니다</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {conversations.map((convo) => (
                <Link key={convo.roomId} href={`/chat/${convo.roomId}`}>
                  <li className="cursor-pointer rounded-lg border border-gray-200 bg-white p-4 transition-colors hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="relative flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-indigo-200 text-sm font-bold text-indigo-600">
                        {convo.other.avatarUrl ? (
                          <img
                            src={convo.other.avatarUrl}
                            alt={convo.other.displayName}
                            className="h-full w-full rounded-full object-cover"
                          />
                        ) : (
                          convo.other.displayName.charAt(0)
                        )}
                        {convo.unreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                            {convo.unreadCount}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-gray-900">{convo.other.displayName}</p>
                          <span className="text-xs text-gray-500">
                            {new Date(convo.updatedAt).toLocaleDateString("ko-KR", {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        <p className="mt-1 truncate text-sm text-gray-600">
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
  );
}
