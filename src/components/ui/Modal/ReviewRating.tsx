"use client";

import Image from "next/image";
import StarEmpty from "@/assets/icon/StarEmpty.svg";
import StarFilled from "@/assets/icon/StarFilled.svg";

interface ReviewRatingProps {
  rate: number;
  setRate: (n: number) => void;
  max?: number; // 기본 5
}

export default function ReviewRating({ rate, setRate, max = 5 }: ReviewRatingProps) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: max }, (_, i) => i + 1).map((star) => {
        const isActive = rate >= star;
        return (
          <button
            key={star}
            type="button"
            onClick={() => {
              if (rate === star)
                setRate(0); // 같은 별 클릭 시 0점으로 초기화
              else setRate(star);
            }}
            className="transition-transform hover:scale-110"
          >
            <Image
              src={isActive ? StarFilled : StarEmpty}
              alt={isActive ? "filled star" : "empty star"}
              width={32}
              height={32}
              className="h-8 w-8 md:h-10 md:w-10 lg:h-12 lg:w-12"
            />
          </button>
        );
      })}
    </div>
  );
}
