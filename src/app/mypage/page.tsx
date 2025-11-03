"use client";

import Header from "./components/Header";
import ProfileSection from "./components/ProfileSection";
import ReviewContainer from "./components/ReviewContainer";
import { useAuthStore } from "@/store/authStore";

export default function Mypage() {
  const { user } = useAuthStore();
  const driverId = user?.id;

  if (!user) {
    return (
      <main className="flex min-h-screen w-full items-center justify-center bg-white">
        <p className="text-lg text-gray-500">로그인이 필요합니다.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full bg-white px-4 md:px-5 lg:px-8 xl:px-60">
      {/* 헤더 */}
      <Header />
      {/* 프로필 영역 */}
      <section className="mt-6 mb-12 px-6">
        <ProfileSection />
      </section>
      <section className="my-10 px-6">
        <div className="border-t border-gray-100" />
      </section>
      {/* 리뷰 영역 */}
      <section className="mt-10 mb-14 px-6">
        {driverId ? (
          <ReviewContainer driverId={driverId} />
        ) : (
          <p className="py-10 text-center text-gray-500">기사님의 ID를 찾을 수 없습니다.</p>
        )}
      </section>
    </main>
  );
}
