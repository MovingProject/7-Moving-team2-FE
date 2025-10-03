import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";
import apiClient from "@/lib/apiClient";

export default function useLogout() {
  const { clearUser } = useAuthStore();

  return useMutation({
    mutationFn: async () => {
      const res = await apiClient.post("/auth/signout");
      console.log("로그아웃 API 응답:", res.data);
      return res.data;
    },
    onSuccess: (data) => {
      console.log("로그아웃 성공:", data);
      clearUser();
    },
    onError: (error) => {
      console.error("로그아웃 실패:", error);
    },
  });
}
