import axios from "axios";
import { useMutation } from "@tanstack/react-query";

export type SignInDTO = { email: string; password: string; role?: "CONSUMER" | "DRIVER" };
export type UserData = { id: string; email: string; name: string; role: string };

export function useSignIn() {
  return useMutation<UserData, unknown, SignInDTO>({
    mutationFn: async (body) => {
      console.log("signIn request body:", body);
      const res = await axios.post("/api/auth/signIn", body, { withCredentials: true });
      console.log("signIn response status:", res.status, "headers:", res.headers);
      return res.data;
    },
  });
}