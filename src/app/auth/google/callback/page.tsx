"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import type { User } from "@/store/authStore";

function GoogleCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setUser = useAuthStore((s) => s.setUser);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // 백엔드에서 리다이렉트 시 쿼리 파라미터로 전달한 user 정보
        const userParam = searchParams.get("user");

        if (!userParam) {
          throw new Error("User data not found");
        }

        // URL 디코딩 후 JSON 파싱
        const userData: User = JSON.parse(decodeURIComponent(userParam));

        // Zustand에 사용자 정보 저장 (localStorage에도 persist됨)
        setUser(userData);

        console.log("✅ Google 로그인 성공:", userData);

        // 프로필 등록 여부에 따라 리다이렉트
        if (userData.isProfileRegistered) {
          router.replace("/landing");
        } else {
          // 프로필 미등록 시 프로필 등록 페이지로
          router.replace("/mypage/profile");
        }
      } catch (error) {
        console.error("❌ Google OAuth callback error:", error);
        // 에러 발생 시 로그인 페이지로 리다이렉트
        router.replace("/login?error=oauth_failed");
      }
    };

    handleCallback();
  }, [router, searchParams, setUser]);

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500"></div>
        <p className="text-gray-600">Google 로그인 처리 중...</p>
      </div>
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500"></div>
            <p className="text-gray-600">로딩 중...</p>
          </div>
        </div>
      }
    >
      <GoogleCallbackContent />
    </Suspense>
  );
}
