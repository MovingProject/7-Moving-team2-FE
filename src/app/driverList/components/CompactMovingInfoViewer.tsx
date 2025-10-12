"use client";

import Image from "next/image";
import { MovingInfo } from "@/components/ui/profile/MovingInfoViewer";

interface CompactMovingInfoViewerProps {
  info: MovingInfo;
}

export default function CompactMovingInfoViewer({ info }: CompactMovingInfoViewerProps) {
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
          <span>{info.rating ?? 0}</span>
          <span className="text-gray-500">({info.reviewCount ?? 0})</span>
        </dd>
      </dl>

      {/* 구분선 */}
      <span className="text-gray-300">|</span>

      {/* 경력 */}
      <dl className="flex items-center gap-1">
        <dt className="sr-only">경력</dt>
        <dd className="flex text-gray-800">{info.careerYears ?? 0}년</dd>
      </dl>

      <span className="text-gray-300">|</span>

      {/* 확정 건수 */}
      <dl className="flex items-center gap-1">
        <dt className="sr-only">거래</dt>
        <dd className="flex gap-0.5 text-gray-800">
          {info.confirmedCount ?? 0}건<span className="ml-0.5 text-gray-500">확정</span>
        </dd>
      </dl>
    </div>
  );
}
