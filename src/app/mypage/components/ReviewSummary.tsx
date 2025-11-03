import Image from "next/image";
import StarEmpty from "@/assets/icon/StarEmpty.svg";
import StarFilled from "@/assets/icon/StarFilled.svg";
import { DriverRatingDistributionResponse } from "@/lib/apis/reviewApi";

interface ReviewSummaryProps {
  ratingData?: DriverRatingDistributionResponse | null;
}

export default function ReviewSummary({ ratingData }: ReviewSummaryProps) {
  const safeData: Required<DriverRatingDistributionResponse> = {
    driverId: ratingData?.driverId ?? "",
    averageRating: typeof ratingData?.averageRating === "number" ? ratingData.averageRating : 0,
    totalReviews: typeof ratingData?.totalReviews === "number" ? ratingData.totalReviews : 0,
    ratings: ratingData?.ratings ?? { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  };

  const average = safeData.averageRating.toFixed(1);
  const rounded = Math.round(safeData.averageRating);
  const counts = [5, 4, 3, 2, 1].map(
    (score) => safeData.ratings[score as keyof typeof safeData.ratings] ?? 0
  );

  const RatingBlock = ({ desktop = false }: { desktop?: boolean }) => (
    <div className="flex flex-col items-center gap-3 md:gap-4">
      <div className="flex items-end gap-2">
        <p className={desktop ? "text-[64px] font-bold" : "text-[48px] font-bold md:text-[64px]"}>
          {average}
        </p>
        <span
          className={
            desktop
              ? "py-2.5 text-[38px] font-bold text-gray-200"
              : "py-1.5 text-[24px] font-bold text-gray-200 md:py-2.5 md:text-[38px]"
          }
        >
          / 5
        </span>
      </div>
      <div className="flex">
        {Array.from({ length: 5 }, (_, i) => (
          <Image
            key={i}
            src={i < rounded ? StarFilled : StarEmpty}
            alt="star"
            width={desktop ? 48 : 32}
            height={desktop ? 48 : 32}
            className="md:h-12 md:w-12"
          />
        ))}
      </div>
    </div>
  );

  const Distribution = () => (
    <div className="w-full space-y-2 md:space-y-1">
      {[5, 4, 3, 2, 1].map((score, i) => {
        const count = counts[i];
        const percent = safeData.totalReviews > 0 ? (count / safeData.totalReviews) * 100 : 0;
        return (
          <div key={score} className="flex items-center gap-4 text-sm md:gap-7">
            <span className="w-6 shrink-0">{score}점</span>
            <div className="h-2 flex-1 rounded bg-gray-200">
              <div className="h-2 rounded bg-yellow-400" style={{ width: `${percent}%` }} />
            </div>
            <span className="w-8 shrink-0 text-left text-gray-500">{count}</span>
          </div>
        );
      })}
    </div>
  );

  return (
    <section className="mb-8 w-full">
      {/* ≤767px : 평점 위 / 분포 아래 (분포만 bg) */}
      <div className="flex flex-col gap-6 md:hidden">
        <RatingBlock />
        <div className="w-full rounded-4xl bg-gray-50 p-5">
          <Distribution />
        </div>
      </div>

      {/* 768–1023px : 왼쪽 평점(밖) / 오른쪽 분포(bg) */}
      <div className="hidden w-full items-start gap-10 md:flex lg:hidden">
        <RatingBlock />
        <div className="flex-1 rounded-4xl bg-gray-50 p-6">
          <Distribution />
        </div>
      </div>

      {/* ≥1024px : 평점 + 분포가 함께 bg 안 */}
      <div className="hidden w-full lg:block">
        <div className="w-full rounded-4xl bg-gray-50 p-6">
          <div className="flex items-center justify-center gap-[83px]">
            <RatingBlock desktop />
            <div className="w-[370px]">
              <Distribution />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
