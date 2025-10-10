"use client";

import CardText from "@/components/ui/card/CardText";
import CompactProfileImage from "./CompactProfileImage";
import LikeButton from "@/components/ui/LikeButton";
import CompactMovingInfoViewer from "./CompactMovingInfoViewer";
import { DriverUser } from "@/types/card";

/**
 * CompactUserProfileArea
 * 기존 UserProfileArea 구조를 유지하되,
 * 모든 텍스트·간격·이미지 크기를 축소한 버전.
 * 별점/리뷰/경력/확정건수는 MovingInfoViewer 내부 그대로 렌더링됨.
 */
export default function CompactUserProfileArea({ user }: { user: DriverUser }) {
  const profile = user.profile;
  if (!profile) return null;

  return (
    <div className="flex items-center justify-between rounded-md border border-gray-100 bg-white px-3 py-2">
      {/* 왼쪽: 프로필 + 정보 */}
      <div className="flex items-center gap-3 overflow-hidden">
        {/* 프로필 이미지 */}
        <div className="relative flex-shrink-0">
          <CompactProfileImage src={profile.image} />
        </div>
        {/* 이름 + 정보 */}
        <div className="flex flex-col justify-center gap-2">
          <CardText className="text-[13px] leading-none font-semibold text-gray-900">
            {profile.nickname ?? user.name}
          </CardText>

          {/* MovingInfoViewer: 별점, 리뷰, 경력, 확정건수 */}
          <CompactMovingInfoViewer
            info={{
              rating: profile.rating,
              reviewCount: profile.reviewCount,
              careerYears: profile.careerYears,
              confirmedCount: profile.confirmedCount,
            }}
          />
        </div>
      </div>

      {/* 오른쪽: 좋아요 버튼 */}
      <LikeButton
        count={profile.likes.likedCount}
        isLiked={profile.likes.isLikedByCurrentUser}
        className="ml-auto scale-[0.85]"
      />
    </div>
  );
}
