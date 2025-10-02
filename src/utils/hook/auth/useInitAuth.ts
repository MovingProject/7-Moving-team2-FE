import { useEffect } from "react";
import { useAuthStore, User } from "@/store/authStore";
import apiClient from "@/lib/apiClient";

interface RefreshResponse {
  success: boolean;
  data: User;
}

export function useInitAuth() {
  const { setUser, clearUser } = useAuthStore();

  useEffect(() => {
    async function fetchUser() {
      try {
        // refresh API 호출 (쿠키 기반)
        const res = await apiClient.post<RefreshResponse>("/auth/refresh");
        console.log("세션 복구 응답:", res.data);

        if (res.data.success && res.data.data) {
          setUser(res.data.data);
        } else {
          clearUser();
        }
      } catch (err) {
        console.error("세션 복구 실패:", err);
        clearUser();
      }
    }

    fetchUser();
  }, [setUser, clearUser]);
}
