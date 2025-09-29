"use client";

import clsx from "clsx";
import SmallMoveIcon from "@/assets/icon/SmallMoveIcon.svg";
import SmallMoveIconSm from "@/assets/icon/SmallMoveIcon-1.svg";
import HomeMoveIcon from "@/assets/icon/HomeMoveIcon.svg";
import HomeMoveIconSm from "@/assets/icon/HomeMoveIcon-1.svg";
import OfficeMoveIcon from "@/assets/icon/OfficeMoveIcon.svg";
import OfficeMoveIconSm from "@/assets/icon/OfficeMoveIcon-1.svg";
import RequestQuoteIcon from "@/assets/icon/RequestQuoteIcon.svg";
import RequestQuoteIconSm from "@/assets/icon/RequestQuoteIcon-1.svg";
import Image from "next/image";

export type IconType = "smallMove" | "homeMove" | "officeMove" | "requestQuote" | "default";
export type IconSize = "sm" | "md";
export type BoxType = "default" | "radius";

interface Icon {
  src: string;
  width: number;
  height: number;
}

interface TagProps {
  /**
   * @param type 태그에 들어갈 아이콘 종류
   * smallMove | homeMove | officeMove | requestQuote | default
   */
  type: IconType;

  /**
   * @param size 아이콘 사이즈
   * sm | md
   */
  size?: IconSize;

  /**
   * @param content 태그에 표시될 텍스트 (선택적)
   */
  content?: string;

  /**
   * @param borderType 태그 모서리 타입
   * default -> 사각형
   * radius -> 둥근 모서리
   */
  borderType?: BoxType;
  selected?: boolean;
}

const iconMap: Record<Exclude<IconType, "default">, Record<IconSize, Icon>> = {
  smallMove: {
    sm: SmallMoveIconSm,
    md: SmallMoveIcon,
  },
  homeMove: {
    sm: HomeMoveIconSm,
    md: HomeMoveIcon,
  },
  officeMove: {
    sm: OfficeMoveIconSm,
    md: OfficeMoveIcon,
  },
  requestQuote: {
    sm: RequestQuoteIconSm,
    md: RequestQuoteIcon,
  },
};

/**
 * Tag 컴포넌트
 *
 * @example
 * <Tag type="smallMove" size="default" content="소형 이사" />
 * <Tag type="requestQuote" size="sm" content="견적 요청" borderType="radius" />
 *
 * @param type - 아이콘 종류 (smallMove | homeMove | officeMove | requestQuote | default)
 * @param size - 아이콘 크기 (sm | md)
 * @param content - 태그에 표시할 텍스트 (선택)
 * @param borderType - 모서리 스타일 (default -> 사각형, radius -> 둥근 모서리) (선택)
 */
export default function Tag({ type, size = "md", content, borderType, selected }: TagProps) {
  const icon = type === "default" ? null : iconMap[type]?.[size] || iconMap[type]?.md;
  const containerClass = clsx(
    "inline-flex items-center px-2 whitespace-nowrap h-8 flex-shrink-0 gap-2",
    selected
      ? "bg-blue-100 text-blue-600"
      : ["smallMove", "homeMove", "officeMove"].includes(type)
        ? "bg-[var(--Primary-blue-100,#E9F4FF)] text-[var(--Primary-blue-200,#1B92FF)]"
        : type === "requestQuote"
          ? "bg-[#FFEEF0] text-[#FF4F64]"
          : "bg-[var(--Background-Background-100,#FAFAFA)] text-black",
    borderType === "radius" ? "rounded-full" : "rounded-md"
  );

  return (
    <div className={containerClass}>
      {icon && (
        <Image src={icon.src} width={icon.width} height={icon.height} alt={`${type} icon`} />
      )}
      {content && <span className="inline-block">{content}</span>}
    </div>
  );
}
