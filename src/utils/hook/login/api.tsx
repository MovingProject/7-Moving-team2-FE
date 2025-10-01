import { useMutation } from "@tanstack/react-query";
import { useAuthStore, User, RoleType } from "@/store/authStore";
import apiClient from "@/lib/apiClient";

interface LoginDTO {
  email: string;
  password: string;
  role: RoleType;
}

export function useLogin() {
  const { setUser } = useAuthStore();

  return useMutation<User, Error, LoginDTO>({
    mutationFn: async (data: LoginDTO) => {
      await apiClient.post("/auth/signin", data);
      const res = await apiClient.get<User>("/users/me");
      return res.data;
    },
    onSuccess: (user) => {
      setUser(user);
    },
    onError: (error) => {
      console.error("로그인 실패:", error);
    },
  });
}
