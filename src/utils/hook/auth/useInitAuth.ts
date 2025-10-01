import { useEffect } from "react";
import { useAuthStore, User } from "@/store/authStore";
import apiClient from "@/lib/apiClient";

export function useInitAuth() {
  const { setUser, clearUser, user } = useAuthStore();

  useEffect(() => {
    async function fetchUser() {
      if (!user?.id) return; // 로그인 한 적 없는 경우
      try {
        const res = await apiClient.get<User>(`/users/${user.id}`);
        setUser(res.data);
      } catch {
        clearUser();
      }
    }
    fetchUser();
  }, [setUser, clearUser, user?.id]);
}
