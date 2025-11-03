"use client";

import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { getDriverRatingDistribution } from "@/lib/apis/reviewApi";
import { LikedDriver } from "@/utils/hook/likes/useLikedQuery";

export default function LikedDriverInfo({ driver }: { driver: LikedDriver }) {
  const { data: ratingData } = useQuery({
    queryKey: ["driverRating", driver.id],
    queryFn: () => getDriverRatingDistribution(driver.id),
    enabled: !!driver.id,
    staleTime: 1000 * 60 * 5,
  });

  const averageRating = ratingData?.averageRating ?? driver.rating ?? 0;
  const totalReviews = ratingData?.totalReviews ?? driver.reviewCount ?? 0;

  return (
    <div className="flex items-center gap-1 text-[10px] whitespace-nowrap text-gray-700 xl:text-sm">
      {/* 별점 */}
      <dl className="flex items-center gap-1">
        <dt className="sr-only">별점</dt>
        <dd className="flex items-center justify-center text-gray-800 xl:gap-1">
          <Image
            src="/icon/star.svg"
            alt="별점"
            width={10}
            height={10}
            className="object-contain"
          />
          <span className="font-medium">{averageRating.toFixed(1)}</span>
          <span className="text-gray-500">({totalReviews})</span>
        </dd>
        <span className="text-gray-300">|</span>
      </dl>

      {/* 경력 */}
      <div className="flex items-center gap-1">
        <span>{driver.careerYears}년</span>
        <span className="text-gray-300">|</span>
      </div>

      {/* 확정 건수 */}
      <div className="flex items-center xl:gap-1">
        <span className="font-medium">{driver.confirmedCount}</span>
        <span className="text-gray-500">확정</span>
      </div>
    </div>
  );
}
