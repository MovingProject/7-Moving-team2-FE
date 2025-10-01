"use client";

import Tag from "@/components/ui/Tag";
import clsx from "clsx";

interface TagFormProps {
  Tags: string[];
  colType: "flex" | "grid"; // flex: 자동 줄 바꿈, grid: 지정 컬럼
  label: string;
  subText?: string;
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
}

export default function TagForm({
  Tags,
  colType,
  label,
  selectedTags,
  subText,
  setSelectedTags,
}: TagFormProps) {
  const handleTagClick = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const containerClass =
    colType === "flex" ? "flex flex-wrap gap-2" : "w-fit grid grid-cols-5 grid-rows-[h-fit] gap-2";

  return (
    <div className="mt-4 flex flex-col gap-4 border-b border-gray-200 pb-8 lg:gap-8">
      <div className="flex flex-col gap-1">
        <label className="block font-semibold lg:text-xl">{label}</label>
        {subText && <p className="text-xs text-gray-400 lg:text-base">{subText}</p>}
      </div>
      <div className={containerClass}>
        {Tags.map((tag) => {
          const isSelected = selectedTags.includes(tag);
          return (
            <div
              key={tag}
              onClick={() => handleTagClick(tag)}
              className={clsx("w-fit cursor-pointer rounded-full transition", {
                "border-primary bg-primary-lightest border": isSelected,
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
