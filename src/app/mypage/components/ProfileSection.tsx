"use client";

import ProfileCard from "@/components/ui/card/ProfileCard";
import { useProfileQuery } from "@/hooks/useProfileQuery";

export default function ProfileSection() {
  const { user: userData, isLoading, error } = useProfileQuery();

  if (isLoading) return <p>로딩 중...</p>;
  if (error) return <p>프로필 정보를 불러오는 중 오류가 발생했습니다.</p>;
  if (!userData) return <p>로그인이 필요합니다.</p>;

  // role이 DRIVER인 경우만 렌더링
  if (userData.role !== "DRIVER") {
    return (
      <section>
        <ProfileCard user={userData} />
      </section>
    );
  }
}
