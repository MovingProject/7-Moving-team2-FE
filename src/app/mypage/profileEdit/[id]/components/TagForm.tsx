"use client";

import { useState } from "react";
import Tag from "@/components/ui/Tag";
import clsx from "clsx";

interface TagFormProps {
  Tags: string[];
  colType: "flex" | "grid"; // flex: 자동 줄 바꿈, grid: 지정 컬럼
  label: string;
}

export default function TagForm({ Tags, colType, label }: TagFormProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleTagClick = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const containerClass =
    colType === "flex"
      ? "flex flex-wrap gap-2"
      : "grid grid-cols-[52px_52px_52px_52px_52px] grid-rows-[h-fit] gap-2";

  return (
    <div>
      <label className="mb-2 block font-medium">{label}</label>
      <div className={containerClass}>
        {Tags.map((tag) => {
          const isSelected = selectedTags.includes(tag);
          return (
            <div
              key={tag}
              onClick={() => handleTagClick(tag)}
              className={clsx("w-fit cursor-pointer rounded-full transition", {
                "border-2 border-blue-500 bg-blue-100": isSelected,
                "border border-gray-300 bg-white": !isSelected,
              })}
            >
              <Tag type="default" content={tag} borderType="radius" selected={isSelected} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
