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
  "/images/avatars/avatartion1.jpg",
  "/images/avatars/avatartion2.jpg",
  "/images/avatars/avatartion3.jpg",
  "/images/avatars/avatartion4.jpg",
  "/images/avatars/avatartion5.jpg",
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
      <div className="flex flex-wrap items-center justify-center gap-1 py-4 md:gap-4">
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
