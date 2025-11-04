"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import clsx from "clsx";
import AvatarSelectModal from "@/components/ui/Modal/AvatarModal";

interface ImageInputAreaProps {
  size?: string;
  className?: string;
  value?: string;
  onChange?: (imageUrl: string) => void;
}

export default function ImageInputArea({
  size = "w-32 h-32",
  className,
  value,
  onChange,
}: ImageInputAreaProps) {
  const DEFAULT_AVATAR = "/images/avatars/avatartion1.jpg";
  const [selected, setSelected] = useState<string>(value || DEFAULT_AVATAR);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (value) {
      setSelected(value);
    } else {
      setSelected(DEFAULT_AVATAR);
    }
  }, [value]);

  useEffect(() => {
    if (!value) {
      onChange?.(DEFAULT_AVATAR);
    }
  }, []);

  const handleSelect = (avatar: string) => {
    setSelected(avatar);
    onChange?.(avatar);
  };

  return (
    <div
      className={clsx("flex flex-col items-start gap-2 border-b border-gray-200 pb-8", className)}
    >
      <label className="font-Pretendard pb-4 leading-[26px] font-semibold text-gray-700 lg:text-xl">
        프로필 이미지
      </label>

      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="relative cursor-pointer transition hover:opacity-80 focus:outline-none"
      >
        <Image
          src={selected}
          alt="선택된 프로필 이미지"
          width={100}
          height={100}
          className={clsx(size, "rounded-full border border-gray-300 object-cover shadow-sm")}
        />
        <div className="pt-2">
          <span className="text-sm text-gray-500">클릭하여 변경</span>
        </div>
      </button>

      {/* 아바타 선택 모달 */}
      <AvatarSelectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleSelect}
        selected={selected}
      />
    </div>
  );
}
