// 실제 모달 완제품 모음 파일입니다.

import { useEffect, useState } from "react";
import Modal from "./Modal";
import Button from "../Button";

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Default 모달
export function DefaultModal({ isOpen, onClose }: BaseModalProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  if (!isOpen) return null;
  return (
    <Modal
      type="default"
      title="지정 견적 요청하기"
      onClose={onClose}
      footer={(size) => (
        <Button
          text="일반 견적 요청 하기"
          variant="primary"
          onClick={handleClick}
          className={size === "md" ? "w-[560px]" : "w-[260px]"}
          textSize={size === "md" ? "desktop" : "mobile"}
        />
      )}
    >
      <p className="text-[16px]">일반 견적 요청을 먼저 진행해 주세요.</p>
    </Modal>
  );
}
