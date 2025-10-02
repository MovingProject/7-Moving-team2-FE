import { useMutation } from "@tanstack/react-query";
import { useAuthStore, User, RoleType } from "@/store/authStore";
import apiClient from "@/lib/apiClient";

interface LoginDTO {
  email: string;
  password: string;
  role: RoleType;
}

interface LoginResponse {
  success: boolean;
  data: User;
}

export function useLogin() {
  const { setUser } = useAuthStore();

  return useMutation<User, Error, LoginDTO>({
    mutationFn: async (data: LoginDTO) => {
      const res = await apiClient.post<LoginResponse>("/auth/signin", data);
      console.log("로그인 API 응답:", res.data);
      return res.data.data;
    },
    onSuccess: (user) => {
      console.log("zustand에 저장할 user:", user);
      setUser(user);
    },
    onError: (error) => {
      console.error("로그인 실패:", error);
    },
  });
}
