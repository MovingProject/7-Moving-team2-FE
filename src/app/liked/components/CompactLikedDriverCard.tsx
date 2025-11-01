"use client";

import { LikedDriver } from "@/utils/hook/likes/useLikedQuery";
import CompactLikedDriverProfile from "./CompactLikedDriverProfile";

export default function CompactLikedDriverCard({
  driver,
  onClickAction,
}: {
  driver: LikedDriver;
  onClickAction?: () => void;
}) {
  return (
    <div
      onClick={onClickAction}
      className="flex cursor-pointer flex-col rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md"
    >
      {/* 상단 프로필 */}
      <div className="flex items-center">
        <CompactLikedDriverProfile driver={driver} />
      </div>
    </div>
  );
}
