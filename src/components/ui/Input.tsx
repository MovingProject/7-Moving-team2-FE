"use client";
import SearchIcon from "@/assets/icon/Search.svg";
import SearchIconSm from "@/assets/icon/Search-1.svg";
import XIcon from "@/assets/icon/X.svg";
import XIconSm from "@/assets/icon/X-1.svg";
import EyeIcon from "@/assets/icon/eye.svg";
import CloseEyeIcon from "@/assets/icon/closeEye.svg";
import clsx from "clsx";
import Image from "next/image";
import { useState } from "react";

export type InputType = "basic" | "search" | "textArea";
type IconType = "left" | "right";
type ErrorPosition = "left" | "right";

interface InputProps {
  type?: InputType;
  value: string | number;
  placeholder?: string;
  error?: string;
  onChange: (value: string) => void;
  icon?: IconType;
  errorPosition?: ErrorPosition;
  size?: "full" | "half";
  inputType?: string;
  className?: string;
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
  inputType = "text",
  className,
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
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

  const defaultBg =
    type === "basic" ? "bg-white" : type === "search" || type === "textArea" ? "bg-gray-100" : "";

  const wrapperClass = clsx(
    `flex relative ${widthClass} ${heightClass}`,
    type === "basic" && "px-4 items-center shrink-0 rounded-2xl border",
    (type === "search" || type === "textArea") && "px-6 rounded-2xl",
    type === "search" && "items-center shrink-0",
    type === "textArea" && "py-4 items-start shrink-0",
    className?.includes("bg-") ? null : defaultBg,

    // basic 타입 테두리 색 설정
    type === "basic" && (error ? "border-warning" : "border-gray-300"),
    className
  );

  const wrapperStyle = error ? { boxShadow: "0 0 0 1px rgba(239,68,68,0.08)" } : undefined;

  const inputClass =
    (type === "textArea"
      ? "w-full h-full resize-none bg-transparent outline-none"
      : "w-full bg-transparent outline-none") + ` ${fontSizeClass}`;

  const handleClear = () => {
    onChange("");
  };

  // 전화번호 자동 포맷 (ex: 010-1234-5678)
  const formatPhoneWithHyphen = (raw: string) => {
    const digits = raw.replace(/\D/g, "");
    if (!digits) return "";
    if (digits.startsWith("010")) {
      if (digits.length <= 3) return digits;
      if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
      return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
    }
    if (digits.length <= 3) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
  };

  const handleInputChange = (val: string) => {
    if (inputType === "tel") {
      const formatted = formatPhoneWithHyphen(val);
      onChange(formatted);
      return;
    }
    onChange(val);
  };

  return (
    <div className={wrapperClass} style={wrapperStyle} aria-invalid={!!error}>
      {icon && icon === "left" && (
        <Image src={size === "half" ? SearchIconSm : SearchIcon} alt="" />
      )}

      {type === "textArea" ? (
        <textarea
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={inputClass}
        />
      ) : (
        <input
          type={inputType === "password" ? (showPassword ? "text" : "password") : inputType}
          value={value}
          placeholder={placeholder}
          onChange={(e) => handleInputChange(e.target.value)}
          className={inputClass}
        />
      )}

      {icon && icon === "right" && (
        <Image src={size === "half" ? XIconSm : XIcon} onClick={handleClear} alt="" />
      )}
      {icon && icon === "right" && (
        <Image src={size === "half" ? SearchIconSm : SearchIcon} alt="" />
      )}

      {/* 비밀번호 보이기/숨기기 토글 */}
      {inputType === "password" && (
        <button
          type="button"
          aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
          onClick={() => setShowPassword((s: boolean) => !s)}
          className="absolute right-3 flex items-center justify-center"
        >
          <Image src={showPassword ? CloseEyeIcon : EyeIcon} alt="" width={20} height={20} />
        </button>
      )}

      {error && (
        <span
          className={`text-warning absolute text-xs ${
            errorPosition === "right" ? "right-2" : "left-2"
          } bottom-[-20px]`}
        >
          {error}
        </span>
      )}
    </div>
  );
}
