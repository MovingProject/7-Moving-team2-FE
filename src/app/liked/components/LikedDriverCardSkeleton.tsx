"use client";

export function LikedDriverCardSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-2 rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
      {/* 태그 영역 */}
      <div className="mb-2 h-5 w-20 rounded-md bg-gray-100" />

      {/* 상단 프로필 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* 프로필 이미지 */}
          <div className="h-12 w-12 rounded-full bg-gray-200" />

          {/* 이름 */}
          <div className="flex flex-col gap-2">
            <div className="h-3 w-24 rounded bg-gray-200" />
            <div className="h-3 w-12 rounded bg-gray-100" />
          </div>
        </div>

        {/* 좋아요 */}
        <div className="h-3 w-6 rounded bg-gray-200" />
      </div>

      {/* 하단 정보 (별점, 경력, 확정건수) */}
      <div className="mt-2 flex items-center gap-4">
        <div className="h-3 w-20 rounded bg-gray-100" />
        <div className="h-3 w-16 rounded bg-gray-100" />
        <div className="h-3 w-24 rounded bg-gray-100" />
      </div>
    </div>
  );
}
