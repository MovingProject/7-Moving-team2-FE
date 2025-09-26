// 제일 기본적인 모달 UI입니다.

import Modal from "./Modal";
import Button from "../Button";

interface DefaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  buttonText?: string;
  onButtonClick?: () => void;
}

export default function DefaultModal({
  isOpen,
  onClose,
  title,
  children,
  buttonText,
  onButtonClick,
}: DefaultModalProps) {
  if (!isOpen) return null;
  return (
    <Modal
      type="default"
      title={title}
      onClose={onClose}
      footer={(size) => (
        <Button
          text={buttonText}
          variant="primary"
          onClick={onButtonClick ?? onClose}
          className={size === "md" ? "w-[560px]" : "w-[260px]"}
          textSize={size === "md" ? "desktop" : "mobile"}
        />
      )}
    >
      {children}
    </Modal>
  );
}
