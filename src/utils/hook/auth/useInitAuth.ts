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
        // --- ① hydration 이후 user가 남아있어도 무조건 최신 프로필로 덮어쓰기 ---
        if (user) {
          console.log("[useInitAuth] 기존 user 감지됨 → refresh + /users/me 재동기화");

          try {
            const refreshRes = await apiClient.post<RefreshResponse>("/auth/refresh");

            if (refreshRes.data?.success || refreshRes.data?.message === "토큰 재발급 성공") {
              const profile: UserData = await getUserProfile();
              // 기존 user 정보와 병합하지 않고 새 데이터로 완전히 덮어씀
              const mapped = mapUserDataToAuthUser(profile, null);
              setUser(mapped);
              console.log("[useInitAuth] refresh + /users/me 완전 덮어쓰기 완료");
            } else {
              console.warn("[useInitAuth] refresh 실패 → 사용자 초기화");
              clearUser();
            }
          } catch (err) {
            console.warn("[useInitAuth] refresh 요청 중 오류 → 사용자 초기화");
            clearUser();
          }

          setIsInitialized(true);
          return;
        }

        // --- ② user 없음 → refresh 기반으로 세션 연장 ---
        console.log("[useInitAuth] user 없음 → refresh 시도");
        const res = await apiClient.post<RefreshResponse>("/auth/refresh");

        if (res.data?.success || res.data?.message === "토큰 재발급 성공") {
          try {
            const profile: UserData = await getUserProfile();
            const mapped = mapUserDataToAuthUser(profile, null);
            setUser(mapped);
            console.log("[useInitAuth] refresh 성공 → /users/me 세팅 완료");
          } catch {
            console.error("[useInitAuth] refresh 성공했지만 /users/me 실패");
            clearUser();
          }
        } else {
          clearUser();
        }
      } catch (err) {
        console.error("[useInitAuth] 인증 초기화 실패:", err);
        clearUser();
      } finally {
        setIsInitialized(true);
      }
    }

    initAuth();
  }, [hasHydrated, isInitialized]);

  return { isInitialized: hasHydrated && isInitialized };
}
