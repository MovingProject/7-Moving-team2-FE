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

export type IconType = "SMALL_MOVE" | "HOME_MOVE" | "OFFICE_MOVE" | "requestQuote" | "default";
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
  SMALL_MOVE: {
    sm: SmallMoveIconSm,
    md: SmallMoveIcon,
  },
  HOME_MOVE: {
    sm: HomeMoveIconSm,
    md: HomeMoveIcon,
  },
  OFFICE_MOVE: {
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
export default function Tag({ type, size = "sm", content, borderType, selected }: TagProps) {
  const isMoveType = ["SMALL_MOVE", "HOME_MOVE", "OFFICE_MOVE"].includes(type);
  const icon = type === "default" ? null : iconMap[type];
  const containerClass = clsx(
    "inline-flex items-center px-2 whitespace-nowrap flex-shrink-0 gap-2",
    "h-7 gap-1.5 px-2 py-1.5 lg:h-8 lg:gap-2 lg:px-4 lg:py-2.5",
    selected
      ? "bg-primary-light text-primary"
      : isMoveType
        ? "bg-primary-light text-primary"
        : type === "requestQuote"
          ? "bg-warning-light text-warning"
          : "bg-gray-100 text-black",
    borderType === "radius" ? "rounded-full" : "rounded-md",
    "text-xs lg:text-base"
  );

  return (
    <div className={containerClass}>
      {icon && (
        <>
          <div className="block lg:hidden">
            <Image
              src={icon.sm.src}
              width={icon.sm.width}
              height={icon.sm.height}
              alt={`${type} icon`}
            />
          </div>
          <div className="hidden lg:block">
            <Image
              src={icon.md.src}
              width={icon.md.width}
              height={icon.md.height}
              alt={`${type} icon`}
            />
          </div>
        </>
      )}
      {content && <span className="inline-block leading-none">{content}</span>}
    </div>
  );
}
