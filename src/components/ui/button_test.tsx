import type { ButtonHTMLAttributes, ReactNode, CSSProperties } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  /**
   * "text"는 버튼에 표시할 라벨(문자열)입니다.
   * 폰트 색상을 지정하려면 textColor를 사용하세요.
   */
  text?: string;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  padding?: string; // 직접 override 할 때 사용
  radius?: "default" | "full";
  bgColor?: string; // optional bg override
  textColor?: string; // optional font color override
  hideOnMobile?: boolean;
  className?: string;
}

const DEFAULT_BACKGROUND_COLOR = "#1B92FF";
const DEFAULT_FONT_COLOR = "#FFFFFF";
const FONT_SIZE_CLASS = "text-[16px] lg:text-[20px]"; // mobile-first: 16px, desktop: 20px

export default function Button({
  children,
  text = "버튼",
  variant = "primary",
  size = "md",
  padding,
  radius = "default",
  bgColor,
  textColor,
  hideOnMobile = false,
  className = "",
  style,
  ...rest
}: ButtonProps) {
  // size -> padding 매핑
  const sizePaddingMap: Record<string, string> = {
    sm: "10px",
    md: "16px",
    lg: "16px 24px",
  };

  const finalPadding = padding ?? sizePaddingMap[size] ?? sizePaddingMap["md"];

  // variant 기본 색상 결정 (오버라이드는 bgColor/textColor로)
  const variantBg =
    variant === "primary"
      ? DEFAULT_BACKGROUND_COLOR
      : variant === "secondary"
        ? "#FFFFFF"
        : "transparent";
  const variantText =
    variant === "primary"
      ? DEFAULT_FONT_COLOR
      : variant === "secondary"
        ? DEFAULT_BACKGROUND_COLOR
        : DEFAULT_BACKGROUND_COLOR;
  // border 제거: secondary도 테두리 없음
  const needsBorder = false;

  const finalBg = rest.disabled ? "#DEDEDE" : (bgColor ?? variantBg);
  const finalText = rest.disabled ? "#8A8A8A" : (textColor ?? variantText);
  const finalBorderColor = bgColor ? bgColor : DEFAULT_BACKGROUND_COLOR;

  const radiusClass = radius === "full" ? "rounded-[50px]" : `rounded-[16px]`;
  const hideClass = hideOnMobile ? "hidden md:inline-flex" : "inline-flex";

  const overrideStyle: CSSProperties = {
    padding: finalPadding,
    backgroundColor: finalBg,
    color: finalText,
    borderColor: needsBorder ? finalBorderColor : undefined,
    borderRadius: radius === "full" ? "50px" : "16px",
    ...style,
  };

  return (
    <button
      {...rest}
      className={`${hideClass} ${radiusClass} ${FONT_SIZE_CLASS} items-center justify-center gap-2 ${className}`}
      style={overrideStyle}
      aria-disabled={rest.disabled}
    >
      {children ?? text}
    </button>
  );
}
