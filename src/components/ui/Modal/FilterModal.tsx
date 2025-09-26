"use client";

import Modal from "./Modal";
import { ResponsiveCheckFilter } from "@/components/ui/Filters/ResponsiveCheckFilter";
import { MOVE_TYPE_OPTIONS, CHECK_FILTER_OPTIONS } from "@/components/ui/Filters/filterOptions";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  moveTypeSelected: string[];
  onToggleMove: (value: string) => void;
  filterSelected: string[];
  onToggleFilter: (value: string) => void;
}

export default function FilterModal({
  isOpen,
  onClose,
  moveTypeSelected,
  onToggleMove,
  filterSelected,
  onToggleFilter,
}: FilterModalProps) {
  if (!isOpen) return null;

  return (
    <Modal
      type="filter"
      onClose={onClose}
      className={(size) =>
        size === "sm"
          ? "fixed bottom-[-250px] max-h-[90vh] w-full rounded-t-4xl"
          : "h-auto w-[375px] rounded-4xl"
      }
    >
      <div className="flex justify-center">
        {/* 일단 하드 코딩, 추후 API 연동 시 변경 예정 */}
        <ResponsiveCheckFilter
          filters={[
            {
              key: "moveType",
              title: "이사 유형",
              options: MOVE_TYPE_OPTIONS,
              selected: moveTypeSelected,
              onToggle: onToggleMove,
            },
            {
              key: "filter",
              title: "추가 필터",
              options: CHECK_FILTER_OPTIONS,
              selected: filterSelected,
              onToggle: onToggleFilter,
            },
          ]}
        />
      </div>
    </Modal>
  );
}
