"use client";

import { useProfileQuery } from "@/hooks/useProfileQuery";
import ConsumerProfileForm from "./components/ConsumerProfileForm";
import DriverProfileForm from "./components/DriverProfileForm";

export default function ProfilePage() {
  const { user: userData, isLoading, error } = useProfileQuery();

  if (isLoading || !userData?.role) {
    return <div className="container mx-auto p-4">로딩 중...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">프로필 정보를 불러오는 중 오류가 발생했습니다.</div>
    );
  }

  if (!userData) {
    return <div className="container mx-auto p-4">로그인이 필요합니다.</div>;
  }

  return (
    <main className="container mx-auto p-4">
      {userData.role === "DRIVER" ? <DriverProfileForm /> : <ConsumerProfileForm />}
    </main>
  );
}
