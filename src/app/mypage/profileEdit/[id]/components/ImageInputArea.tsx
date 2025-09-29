"use client";

import { useState } from "react";
import Image from "next/image";
import upload from "@/assets/img/upload.svg"; // 👉 기본 이미지

interface ImageInputAreaProps {
  size?: string; // Tailwind 크기 (예: "w-32 h-32")
}

export default function ImageInputArea({ size = "w-32 h-32" }: ImageInputAreaProps) {
  const [preview, setPreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };
  return (
    <div className="flex flex-col items-start gap-2 border-b border-[#F2F2F2] pb-8">
      <label
        htmlFor="imageUpload"
        className="font-Pretendard text-[16px] leading-[26px] font-semibold text-[var(--Black-Black-300,#373737)]"
      >
        프로필 이미지
      </label>

      {/* 숨겨진 input */}
      <input
        id="imageUpload"
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
      />

      {/* 이미지 클릭 시 업로드 */}
      <label htmlFor="imageUpload" className="cursor-pointer">
        <Image
          src={preview || upload.src} // 👉 upload 이미지가 기본값
          alt="업로드 이미지"
          className={`${size} h-4 w-4 border border-gray-300 object-cover shadow-sm transition hover:opacity-80`} // 사이즈 임의로 넣었음
        />
      </label>
    </div>
  );
}
