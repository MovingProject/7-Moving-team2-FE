import apiClient from "@/lib/apiClient";
import { useMutation } from "@tanstack/react-query";

export type RoleType = "CONSUMER" | "DRIVER";

export interface SignUpDTO {
  email: string;
  password: string;
  passwordConfirm: string;
  name: string;
  phoneNumber: string;
  role: RoleType;
}

export interface UserData {
  id: string;
  email: string;
  name: string;
  role: RoleType;
  createdAt: string;
}

export function useSignup() {
  return useMutation<UserData, Error, SignUpDTO>({
    mutationFn: async (data: SignUpDTO) => {
      const res = await apiClient.post<UserData>("/auth/signup", data);
      return res.data;
    },
    onError: (err) => {
      console.error("회원가입 에러:", err);
    },
  });
}
