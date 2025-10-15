import { useEffect, useState } from "react";
import { useAuthStore, useHasHydrated, User } from "@/store/authStore";
import apiClient from "@/lib/apiClient";
import { getUserProfile } from "../profile/profile";
import { mapUserDataToAuthUser } from "@/utils/mappers/useMappers";
import { UserData } from "@/types/card";

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
      } catch (err: any) {
        console.warn("[useInitAuth] /users/me 실패 → 로그인 필요");
        clearUser();
      } finally {
        setIsInitialized(true);
      }
    }

    initAuth();
  }, [hasHydrated, isInitialized]);

  return { isInitialized: hasHydrated && isInitialized };
}
