import Image from "next/image";
import StarEmpty from "@/assets/icon/StarEmpty.svg";
import StarFilled from "@/assets/icon/StarFilled.svg";

interface Review {
  rating: number;
}

interface ReviewSummaryProps {
  reviews: Review[];
}

export default function ReviewSummary({ reviews }: ReviewSummaryProps) {
  const total = reviews.length;
  const average =
    total > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / total).toFixed(1) : "0.0";

  const counts = [5, 4, 3, 2, 1].map((score) => reviews.filter((r) => r.rating === score).length);

  return (
    <div className="mb-8 rounded-4xl bg-gray-50 p-6">
      <div className="flex flex-row items-center justify-center gap-[83px]">
        {/* 평점 */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex flex-row items-end justify-center gap-2">
            <p className="text-[64px] font-bold">{average}</p>
            <span className="py-2.5 text-[38px] font-bold text-gray-200">/ 5</span>
          </div>
          <div className="flex">
            {Array.from({ length: 5 }, (_, i) => (
              <Image
                key={i}
                src={i < Math.round(Number(average)) ? StarFilled : StarEmpty}
                alt="star"
                width={48}
                height={48}
              />
            ))}
          </div>
        </div>

        {/* 점수 분포도 */}
        <div className="mt-4 space-y-1">
          {[5, 4, 3, 2, 1].map((score, i) => (
            <div key={score} className="flex items-center gap-7 text-sm">
              <span className="w-6">{score}점</span>
              <div className="h-2 w-[25vw] flex-1 rounded bg-gray-200">
                <div
                  className="h-2 rounded bg-yellow-400"
                  style={{
                    width: `${total > 0 ? (counts[i] / total) * 100 : 0}%`,
                  }}
                />
              </div>
              <span className="w-8 text-left text-gray-500">{counts[i]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
