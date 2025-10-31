"use client";

import { useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import DefaultModal from "@/components/ui/Modal/DefaultModal";

interface AvatarSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (avatar: string) => void;
  selected?: string;
}

const avatarList = [
  "/images/avatars/avatartion1.jpg", // 보라맨
  "/images/avatars/avatartion2.jpg", // 파랑맨
  "/images/avatars/avatartion3.jpg", // 빨강맨
  "/images/avatars/avatartion4.jpg", // 초록맨
  "/images/avatars/avatartion5.jpg", // 노랑맨
  "/images/avatars/avatartion6.png", // 보라근육맨
  "/images/avatars/avatartion8.png", // 파랑근육맨
  "/images/avatars/avatartion13.png", // 빨강근육맨
  "/images/avatars/avatartion10.png", // 초록근육맨
  "/images/avatars/avatartion14.png", // 노랑근육맨
  "/images/avatars/avatartion7.png", // 보라근육걸
  "/images/avatars/avatartion9.png", // 파랑근육걸
  "/images/avatars/avatartion12.png", // 빨강근육걸
  "/images/avatars/avatartion11.png", // 초록근육걸
  "/images/avatars/avatartion15.png", // 노랑근육걸
];

export default function AvatarSelectModal({
  isOpen,
  onClose,
  onSelect,
  selected,
}: AvatarSelectModalProps) {
  const [tempSelected, setTempSelected] = useState<string>(selected ?? avatarList[0]);

  const handleConfirm = () => {
    onSelect(tempSelected);
    onClose();
  };

  return (
    <DefaultModal
      isOpen={isOpen}
      onClose={onClose}
      title="프로필 이미지 선택"
      buttonText="이미지 선택"
      onButtonClick={handleConfirm}
    >
      <div className="grid grid-cols-5 place-items-center gap-2 py-4 md:gap-4">
        {avatarList.map((avatar) => (
          <button
            key={avatar}
            type="button"
            onClick={() => setTempSelected(avatar)}
            className={clsx(
              "relative rounded-full border-2 transition hover:opacity-80 focus:outline-none",
              tempSelected === avatar ? "border-primary" : "border-transparent"
            )}
          >
            <Image
              src={avatar}
              alt="아바타 선택"
              width={50}
              height={50}
              className="rounded-full object-fill md:h-15 md:w-15"
            />
            {tempSelected === avatar && (
              <div className="border-primary pointer-events-none absolute inset-0 rounded-full border-2"></div>
            )}
          </button>
        ))}
      </div>
    </DefaultModal>
  );
}
