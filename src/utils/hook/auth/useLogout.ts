import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";
import apiClient from "@/lib/apiClient";

export default function useLogout() {
  const { clearUser } = useAuthStore();

  return useMutation({
    mutationFn: async () => {
      await apiClient.post("/auth/signout");
    },
    onSuccess: () => {
      clearUser();
    },
    onError: (error) => {
      console.error("로그아웃 실패:", error);
    },
  });
}
