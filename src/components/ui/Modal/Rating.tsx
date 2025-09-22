"use client";

import { useEffect, useState } from "react";
import StarMd from "@/assets/icon/Star-md.svg";
import StarYellowMd from "@/assets/icon/StarYellow-md.svg";
import StarXl from "@/assets/icon/Star-xl.svg";
import StarYellowXl from "@/assets/icon/StarYellow-xl.svg";

interface RatingProps {
  rating: number;
  setRating: (n: number) => void;
  max?: number; // 기본 5
  breakpoint?: number; // 반응형 기준 (기본 1024px)
}

export default function Rating({ rating, setRating, max = 5, breakpoint = 1024 }: RatingProps) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(`(min-width: ${breakpoint}px)`);
    const handler = () => setIsDesktop(media.matches);
    handler();
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, [breakpoint]);

  const EmptyIcon = isDesktop ? StarXl : StarMd;
  const FilledIcon = isDesktop ? StarYellowXl : StarYellowMd;

  return (
    <div className="flex flex-col gap-2">
      <p className="text-lg font-bold text-[#373737]">평점을 선택해 주세요</p>
      <div className="flex">
        {Array.from({ length: max }, (_, i) => i + 1).map((star) => {
          const isActive = rating >= star;
          return (
            <button
              key={star}
              type="button"
              onClick={() => {
                if (rating === star)
                  setRating(0); // 같은 별 클릭 시 0점으로 초기화
                else setRating(star);
              }}
            >
              <img
                src={isActive ? FilledIcon.src : EmptyIcon.src}
                alt={isActive ? "filled star" : "empty star"}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
