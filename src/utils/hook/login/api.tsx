import axios from "axios";
import { useMutation } from "@tanstack/react-query";

const host = "/api";
const api = axios.create({
  baseURL: host,
  headers: { "Content-Type": "application/json" },
});

type roleType = "CONSUMER" | "DRIVER";
interface LoginDTO {
  email: string;
  password: string;
  role: roleType;
}

interface UserData {
  id: string;
  email: string;
  name: string;
  role: roleType;
  createdAt: string;
  isProfileRegistered: boolean;
}

interface LoginResponse {
  success: boolean;
  data: UserData;
}

export function useLogin() {
  return useMutation<LoginResponse, Error, LoginDTO>({
    mutationFn: async (data: LoginDTO) => {
      const res = await api.post<LoginResponse>("/auth/signin", data);
      return res.data;
    },
    onError: (error) => {
      // TODO : ERROR 모달로 이동해서 로그인실패했습니다 ㄱ
    },
  });
}
