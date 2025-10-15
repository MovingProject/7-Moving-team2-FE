import { useEffect, useState } from "react";
import { useAuthStore, useHasHydrated, User } from "@/store/authStore";
import apiClient from "@/lib/apiClient";
import { getUserProfile } from "../profile/profile";
import { mapUserDataToAuthUser } from "@/utils/mappers/useMappers";
import { UserData } from "@/types/card";
import { AxiosError } from "axios";

interface RefreshResponse {
  success?: boolean;
  data?: User;
  message?: string;
}

export function useInitAuth() {
  const hasHydrated = useHasHydrated(); // hydration 완료 대기
  const { user, setUser, clearUser } = useAuthStore();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // hydration이 완료되지 않았으면 대기
    if (!hasHydrated) {
      console.log("[useInitAuth] hydration 대기 중...");
      return;
    }

    // 공개 페이지에서는 인증 초기화 건너뛰기
    const publicPages = ["/signUp", "/login", "/landing", "/"];
    if (typeof window !== "undefined") {
      const currentPath = window.location.pathname;
      if (publicPages.includes(currentPath)) {
        console.log("[useInitAuth] 공개 페이지 - 인증 초기화 건너뛰기:", currentPath);
        setIsInitialized(true);
        return;
      }
    }

    // 이미 초기화되었으면 스킵
    if (isInitialized) return;

    async function initAuth() {
      try {
        console.log("[useInitAuth] /users/me로 세션 상태 확인");
        const profile: UserData = await getUserProfile();
        const mapped = mapUserDataToAuthUser(profile, null);
        setUser(mapped);
        console.log("[useInitAuth] 세션 유효 → 사용자 세팅 완료");
      } catch (err) {
        const axiosError = err as AxiosError<{ message?: string }>;
        const status = axiosError.response?.status;
        const message = axiosError.response?.data?.message || "";

        // 500 에러 + "프로필이 없습니다" 메시지는 정상 처리 (로그아웃 안 함)
        if (status === 500 && message.includes("프로필이 없습니다")) {
          console.log("[useInitAuth] 프로필 미등록 상태 - 로그인 유지");
          // user는 localStorage에서 이미 복원되었으므로 그대로 유지
        } else if (status === 401 || status === 403) {
          // 인증/권한 에러만 로그아웃 처리
          console.warn("[useInitAuth] 인증 실패 → 로그아웃");
          clearUser();
        } else {
          // 기타 에러는 로그만 출력 (로그아웃 안 함)
          console.warn("[useInitAuth] 프로필 조회 실패:", err);
        }
      } finally {
        setIsInitialized(true);
      }
    }

    initAuth();
  }, [hasHydrated, isInitialized]);

  return { isInitialized: hasHydrated && isInitialized };
}
