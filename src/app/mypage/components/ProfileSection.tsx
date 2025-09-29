"use client";

import ProfileCard from "@/components/ui/card/ProfileCard";
import { getRandomProfileImage } from "@/utils/constant/getProfileImage";
import { UserData } from "@/types/card";

export default function ProfileSection() {
  const user: UserData = {
    userId: "user-driver-001",
    name: "김코드",
    role: "DRIVER",
    profile: {
      driverId: "drv-001",
      nickname: "김코드 기사님",
      oneLiner: "고객님의 물품을 소중하고 안전하게 운송하여 드립니다.",
      image: getRandomProfileImage(),
      reviewCount: 178,
      rating: 5.0,
      careerYears: 7,
      confirmedCount: 343,
      driverServiceTypes: ["SMALL_MOVE", "HOME_MOVE"],
      driverServiceAreas: ["SEOUL", "GYEONGGI"],
      likes: { likedCount: 20, isLikedByCurrentUser: false },
    },
  };

  return (
    <section>
      <ProfileCard user={user} />
    </section>
  );
}
