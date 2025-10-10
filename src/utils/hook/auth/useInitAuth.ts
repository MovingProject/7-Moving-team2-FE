import { useEffect, useState } from "react";
import { useAuthStore, useHasHydrated, User } from "@/store/authStore";
import apiClient from "@/lib/apiClient";

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
    const publicPages = ['/signUp', '/login', '/landing', '/'];
    if (typeof window !== 'undefined') {
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
        // localStorage에서 복원된 user가 있으면 그대로 사용
        if (user) {
          console.log("[useInitAuth] localStorage에서 user 복원됨:", user.email);
          setIsInitialized(true);

          // 백그라운드에서 토큰 유효성 검증
          try {
            await apiClient.post<RefreshResponse>("/auth/refresh");
            console.log("[useInitAuth] 토큰 유효성 검증 완료");
          } catch (err) {
            console.warn("[useInitAuth] 토큰 만료, 로그아웃");
            clearUser();
          }
          return;
        }

        // user가 없으면 refresh 시도 (최초 방문/로그아웃 상태)
        console.log("[useInitAuth] localStorage에 user 없음 → refresh 시도");
        const res = await apiClient.post<RefreshResponse>("/auth/refresh");

        if (res.data?.success && res.data?.data) {
          console.log("[useInitAuth] refresh로 user 획득:", res.data.data.email);
          setUser(res.data.data);
        } else if (res.data?.message === "토큰 재발급 성공") {
          console.log("[useInitAuth] refresh 성공했지만 user 데이터 없음");
        }
      } catch (err) {
        console.log("[useInitAuth] refresh 실패 (로그인 안 된 상태)");
      } finally {
        setIsInitialized(true);
      }
    }

    initAuth();
  }, [hasHydrated, isInitialized]); // hasHydrated를 의존성에 추가

  return { isInitialized: hasHydrated && isInitialized };
}
