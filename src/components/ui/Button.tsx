import type { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

// ## 기본 값(<Button />만 넣었을 때)
// * variant="primary" / 파란색 백그라운드, secondary는 하얀색 백그라운드
// * size="md" / padding 16px
// * radius="default" / radius 16px, full은 로그인 페이지(50px)
// * className="w-full" / 컨테이너 좌우 가득참(필요시 w-[300px] 이런식으로 직접 입력)
// * 기본 type=button / submit 방지
// <Button
// text="버튼" variant="primary" size="md" radius="default" textSize="desktop"
// textColor="text-primary" className="w-full" />
//------------
// ## 사용 방법(text, className)
// <Button text="버튼 내 텍스트(필수 입력)"
// className="필요한 크기(w-[300px]), 입력x는 컨테이너 w-full" 필요한 옵션="입력" />
//------------
// ## 비활성화 버튼
// <Button disabled />

type Variant = "primary" | "secondary";
type Size = "sm" | "md" | "lg" | "xl";
type Radius = "default" | "full";
type TextSize = "desktop" | "mobile";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  text?: string;
  variant?: Variant;
  size?: Size;
  padding?: string; // 직접 제어 할 때 사용
  radius?: Radius;
  bgColor?: string;
  textSize?: TextSize;
  textColor?: string;
  hideOnMobile?: boolean;
  className?: string;
}

const variantMap: Record<Variant, string> = {
  // disabled 상태 폰트 색상 white -> gray-500으로 변경(가독성)
  primary: clsx(
    "bg-primary text-white",
    "border-none cursor-pointer",
    "hover:bg-primary-softer active:bg-primary-dark",
    "disabled:bg-gray-200 disabled:text-gray-500 disabled:border-none disabled:cursor-not-allowed"
  ),
  secondary: clsx(
    "bg-white text-primary border border-primary",
    "cursor-pointer hover:bg-primary-light active:bg-primary-dark",
    "disabled:bg-gray-200 disabled:text-gray-500 disabled:border-none disabled:cursor-not-allowed"
  ),
};

const sizeMap: Record<Size, string> = {
  sm: "p-[10px]", // header 로그인 버튼
  md: "p-4", // 5글자 이상 버튼, 16px
  lg: "py-4 px-6", // 4글자 이하 버튼, 16px 24px
  xl: "py-4 pl-[108px] pr-[99px]", // mobile 아이콘 있는 버튼에 적용
};

const radiusMap: Record<Radius, string> = {
  default: "rounded-2xl", // radius 16px
  full: "rounded-[50px]", // 랜딩 페이지에서만 사용
};

const fontSizeMap: Record<TextSize, string> = {
  mobile: "text-[16px]",
  desktop: "text-[20px]",
};

export default function Button({
  children,
  text = "버튼",
  variant = "primary",
  size = "md",
  padding,
  radius = "default",
  bgColor,
  textSize = "desktop",
  textColor,
  hideOnMobile = false,
  className = "w-full",
  type = "button",
  style, // 직접 스타일링 가능 하도록 확장
  disabled,
  ...rest // 버튼 고유 속성(type, onClick, disabled 등) 상속
}: ButtonProps) {
  const base = "inline-flex items-center justify-center transition-colors select-none";

  return (
    <button
      type={type}
      disabled={disabled}
      className={clsx(
        base,
        variantMap[variant],
        sizeMap[size],
        radiusMap[radius],
        fontSizeMap[textSize],
        // 옵션 적용(있을 때만)
        padding, // ex) "px-6 py-3"
        bgColor, // ex) "bg-[#1B92FF]"
        textColor, // ex) "text-black"
        hideOnMobile && "hidden md:inline-flex",
        className
      )}
      style={style}
      {...rest}
    >
      {children ?? text}
    </button>
  );
}
