"use client";

import Modal from "./Modal";
import { ResponsiveMoveAndFilter } from "@/components/ui/Filters/Filters";

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
          ? "fixed bottom-[-250px] max-h-[90vh] w-full rounded-t-[32px]"
          : "h-auto w-[375px] rounded-[32px]"
      }
    >
      <ResponsiveMoveAndFilter
        moveTypeSelected={moveTypeSelected}
        onToggleMove={onToggleMove}
        filterSelected={filterSelected}
        onToggleFilter={onToggleFilter}
      />
    </Modal>
  );
}
