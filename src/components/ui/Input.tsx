"use client";
import SearchIcon from "@/assets/icon/Search.svg";
import SearchIconSm from "@/assets/icon/search-1.svg";
import XIcon from "@/assets/icon/X.svg";
import XIconSm from "@/assets/icon/X-1.svg";

type InputType = "basic" | "search" | "textArea";
type IconType = "left" | "right";
type ErrorPosition = "left" | "right";

interface InputProps {
  type?: InputType;
  value: string;
  placeholder?: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  icon?: IconType;
  errorPosition?: ErrorPosition;
  size?: "full" | "half";
}

/**
 * @component Input
 * @description Input 컴포넌트
 * - 3가지 타입 [기본 , 서치바 , 텍스트아레나]
 * - 사이즈는 2가지 타입 [640px, 320px]
 * - 에러글씨는 좌/우 설정 가능
 *
 * @example
 * <Input
 *   type="basic"          // "basic" | "search" | "textArea" → 필드 타입
 *   value={value}         // 입력 값
 *   placeholder="이름 입력" // placeholder 텍스트
 *   onChange={(e) => setValue(e.target.value)} // 값 변경 이벤트
 *   icon="left"           // "left" | "right" → 아이콘 위치
 *   error="필수 입력"      // 에러 메시지
 *   errorPosition="right" // "left" | "right" → 에러 메시지 위치
 *   size="half"           // "full" | "half" → 입력창 크기
 * />
 */
export default function Input({
  type = "basic",
  value,
  placeholder,
  error,
  icon,
  errorPosition,
  onChange,
  size = "full",
}: InputProps) {
  const baseWidth = type === "basic" ? 640 : 560;
  const fontSizeClass = size === "half" ? "text-sm" : "text-base";
  const widthClass =
    size === "half"
      ? "w-full max-w-[320px]"
      : type === "basic"
        ? "w-full max-w-[640px]"
        : "w-full max-w-[560px]";

  const heightClass =
    size === "half"
      ? type === "textArea"
        ? "h-[80px]"
        : "h-[32px]"
      : type === "textArea"
        ? "h-[160px]"
        : "h-[64px]";

  const wrapperClass =
    `flex ${widthClass} ${heightClass} ` +
    (type === "basic"
      ? "px-4 items-center shrink-0 rounded-2xl border border-[#E6E6E6] bg-[#FFF]"
      : type === "search"
        ? "px-6 items-center shrink-0 rounded-2xl bg-[#FAFAFA]"
        : "px-6 py-4 items-start shrink-0 rounded-2xl bg-[#F7F7F7]");

  const inputClass =
    (type === "textArea"
      ? "w-full h-full resize-none bg-transparent outline-none"
      : "w-full bg-transparent outline-none") + ` ${fontSizeClass}`;

  const handleClear = () => {
    const syntheticEvent = {
      target: { value: "" },
    } as unknown as React.ChangeEvent<HTMLInputElement>;
    onChange(syntheticEvent);
  };

  return (
    <div className={wrapperClass + " relative"}>
      {icon && icon === "left" && <img src={size === "half" ? SearchIconSm.src : SearchIcon.src} />}

      {type === "textArea" ? (
        <textarea
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          className={inputClass}
        />
      ) : (
        <input
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          className={inputClass}
        />
      )}

      {icon && icon === "right" && (
        <img src={size === "half" ? XIconSm.src : XIcon.src} onClick={handleClear} />
      )}
      {icon && icon === "right" && (
        <img src={size === "half" ? SearchIconSm.src : SearchIcon.src} />
      )}

      {error && (
        <span
          className={`absolute text-xs text-red-500 ${
            errorPosition === "right" ? "right-2" : "left-2"
          } bottom-[-20px]`}
        >
          {error}
        </span>
      )}
    </div>
  );
}
