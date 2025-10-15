"use client";

import { useProfileQuery } from "@/hooks/useProfileQuery";
import { useAuthStore } from "@/store/authStore";
import LogoSpinner from "@/components/ui/LogoSpinner";
import ConsumerProfileForm from "./components/ConsumerProfileForm";
import DriverProfileForm from "./components/DriverProfileForm";

export default function ProfilePage() {
  const { user: userData, isLoading } = useProfileQuery();
  const authUser = useAuthStore((s) => s.user);

  // 로딩 중일 때만 로딩 표시
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LogoSpinner />
      </div>
    );
  }

  // authUser가 없으면 로그인 필요
  if (!authUser?.role) {
    return <div className="container mx-auto p-4">로그인이 필요합니다.</div>;
  }

  // userData가 null이거나 에러가 있어도 프로필 등록 폼 표시
  // authStore의 role을 사용하여 폼 표시
  return (
    <main className="container mx-auto p-4">
      {authUser.role === "DRIVER" ? <DriverProfileForm /> : <ConsumerProfileForm />}
    </main>
  );
}
