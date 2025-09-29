"use client";

import Image from "next/image";
import StarEmpty from "@/assets/icon/StarEmpty.svg";
import StarFilled from "@/assets/icon/StarFilled.svg";

interface RatingProps {
  rate: number;
  setRate: (n: number) => void;
  max?: number; // 기본 5
}

export default function Rating({ rate, setRate, max = 5 }: RatingProps) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-lg font-bold text-gray-700">평점을 선택해 주세요</p>
      <div className="flex">
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
            >
              <Image
                src={isActive ? StarFilled : StarEmpty}
                alt={isActive ? "filled star" : "empty star"}
                className="h-6 w-6 lg:h-12 lg:w-12"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
