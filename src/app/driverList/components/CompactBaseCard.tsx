"use client";

import React from "react";
import clsx from "clsx";
import { CardProvider, cardTypes } from "@/components/ui/card/CardContext";
import { IconType } from "@/components/ui/Tag";
import { QuotationData, RequestData, UserData } from "@/types/card";

interface CompactBaseCardProps {
  children: React.ReactNode;
  cardType?: cardTypes;
  className?: string;
}

/** CompactCard가 사용하는 공통 타입 정의 */
export interface CompactCommonCardProps {
  user: UserData;
  request?: RequestData;
  quotation?: QuotationData;
}

export type CompactTagData = {
  type: IconType;
  content: string;
};

/**
 * CompactBaseCard
 * 기존 BaseCard 구조와 기능은 동일하지만,
 * - border radius 작게
 * - padding 여유 제거
 * - 내부 flex gap 최소화
 * 으로 좁은 영역에서도 안정적으로 보이게 조정한 버전
 */
export default function CompactBaseCard({
  children,
  cardType = "default",
  className,
}: CompactBaseCardProps) {
  return (
    <CardProvider cardType={cardType}>
      <div
        className={clsx(
          // 기존 BaseCard: flex flex-col rounded-xl
          // compact: 둥근 정도, 그림자, padding 축소
          "flex flex-col gap-2 rounded-lg border border-gray-200 bg-white p-3",
          className
        )}
      >
        {children}
      </div>
    </CardProvider>
  );
}
