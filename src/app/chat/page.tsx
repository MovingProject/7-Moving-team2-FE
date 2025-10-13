"use client";

import Link from "next/link";
import { conversations } from "./mock/data";

export default function ChatHomePage() {
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
          <div className="space-y-3">
            {conversations.map((convo) => (
              <Link key={convo.id} href={`/chat/${convo.id}`}>
                <div className="rounded-lg border border-gray-200 bg-white p-4 transition-colors hover:bg-gray-50 active:bg-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="mb-1 font-semibold text-gray-900">{convo.name}</h3>
                      <p className="truncate text-sm text-gray-600">{convo.lastMessage}</p>
                    </div>
                    <div className="ml-3">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* 빈 상태 또는 추가 정보 */}
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
