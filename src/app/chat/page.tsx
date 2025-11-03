"use client";

import Link from "next/link";
import { ChatRoomInfo } from "@/types/chat";

export default function ChatHomePage() {
  // TODO: 백엔드 채팅방 목록 API 구현 후 연동 필요
  const conversations: ChatRoomInfo[] = [];

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
          {/* 빈 상태 */}
          {conversations.length === 0 && (
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
          )}
        </div>
      </div>
    </div>
  );
}
