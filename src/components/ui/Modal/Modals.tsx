// 실제 모달 완제품 모음 파일입니다.

import { useEffect, useState } from "react";
import { Modal } from "./Modal";
import Button from "../Button";
import { ResponsiveMoveAndFilter } from "../Filters/Filters";

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Filter 모달
export function FilterModal({ isOpen, onClose }: BaseModalProps) {
  const [device, setDevice] = useState<"mobile" | "tablet" | "desktop">("desktop");
  const [moveTypeSelected, setMoveTypeSelected] = useState<string[]>([]);
  const [filterTypeSelected, setFilterTypeSelected] = useState<string[]>([]);
  const toggleMoveType = (value: string) => {
    setMoveTypeSelected((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const toggleFilterType = (value: string) => {
    setFilterTypeSelected((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      if (width < 768) setDevice("mobile");
      else if (width < 1024) setDevice("tablet");
      else setDevice("desktop");
    };
    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  if (!isOpen) return null;

  // 데스크탑은 모달 대신 바로 필터 출력
  if (device === "desktop") {
    return (
      <div className="p-4">
        <ResponsiveMoveAndFilter
          moveTypeSelected={moveTypeSelected}
          onToggleMove={toggleMoveType}
          filterSelected={filterTypeSelected}
          onToggleFilter={toggleFilterType}
        />
      </div>
    );
  }

  // 모바일 → filter sm 모달
  if (device === "mobile") {
    return (
      <Modal type="filter" size="sm" onClose={onClose} title="필터">
        <ResponsiveMoveAndFilter
          moveTypeSelected={moveTypeSelected}
          onToggleMove={toggleMoveType}
          filterSelected={filterTypeSelected}
          onToggleFilter={toggleFilterType}
        />
      </Modal>
    );
  }

  // 태블릿 → filter md 모달
  if (device === "tablet") {
    return (
      <Modal type="filter" size="md" onClose={onClose} title="필터">
        <ResponsiveMoveAndFilter
          moveTypeSelected={moveTypeSelected}
          onToggleMove={toggleMoveType}
          filterSelected={filterTypeSelected}
          onToggleFilter={toggleFilterType}
        />
      </Modal>
    );
  }

  return null;
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
      <p>일반 견적 요청을 먼저 진행해 주세요.</p>
    </Modal>
  );
}
