import { useMutation } from "@tanstack/react-query";
import { useAuthStore, User, RoleType } from "@/store/authStore";
import apiClient from "@/lib/apiClient";

interface LoginDTO {
  email: string;
  password: string;
  role: RoleType;
}

interface LoginResponse {
  user: User;
}

export function useLogin() {
  const { setUser } = useAuthStore();

  return useMutation<User, Error, LoginDTO>({
    mutationFn: async (data: LoginDTO) => {
      const res = await apiClient.post<LoginResponse>("/auth/signin", data);
      return res.data.user;
    },
    onSuccess: (user) => {
      setUser(user);
    },
    onError: (error) => {
      console.error("로그인 실패:", error);
    },
  });
}
