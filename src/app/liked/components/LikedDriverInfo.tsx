"use client";

import Image from "next/image";
import { LikedDriver } from "@/utils/hook/liked/useLikedQuery";

export default function LikedDriverInfo({ driver }: { driver: LikedDriver }) {
  return (
    <div className="flex items-center gap-1 text-[10px] whitespace-nowrap text-gray-700">
      {/* 별점 */}
      <dl className="flex items-center gap-1">
        <dt className="sr-only">별점</dt>
        <dd className="flex items-center gap-0.5 text-gray-800">
          <Image
            src="/icon/star.svg"
            alt="별점"
            width={10}
            height={10}
            className="object-contain"
          />
          <span className="font-medium">{driver.rating.toFixed(1)}</span>
          <span className="text-gray-500">({driver.reviewCount})</span>
        </dd>
      </dl>

      {/* 구분선 */}
      <span className="text-gray-300">|</span>

      {/* 경력 */}
      <div className="flex items-center gap-1">
        <span>{driver.careerYears}</span>
      </div>

      <span className="text-gray-300">|</span>

      {/* 확정 건수 */}
      <div className="flex items-center gap-1">
        <span className="font-medium">{driver.confirmedCount}</span>
        <span className="text-gray-500">확정</span>
      </div>
    </div>
  );
}
