import axios from "axios";
import { useAuthStore } from "@/store/authStore";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "/api",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// 요청 인터셉터
apiClient.interceptors.request.use(
  (config) => {
    console.log("[요청]", config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
apiClient.interceptors.response.use(
  (res) => {
    return res;
  },
  async (error) => {
    const originalRequest = error.config;

    // access token 만료 (401) + 아직 재시도 안 한 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        console.log("[인터셉터] 401 발생 → refresh 시도");

        // refresh는 토큰 갱신만 (user 데이터 건드리지 않음)
        await axios.post(
          (process.env.NEXT_PUBLIC_API_URL ?? "/api") + "/auth/refresh",
          {},
          { withCredentials: true }
        );

        console.log("[인터셉터] refresh 성공 → 원래 요청 재시도");

        // user는 localStorage에서 자동 복원되므로 여기서 처리 안 함
        // refresh 성공했으니 원래 요청 재시도
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error("[인터셉터] refresh 실패 → 로그아웃");
        // refresh도 실패하면 완전히 로그아웃
        const { clearUser } = useAuthStore.getState();
        clearUser();

        // 로그인 페이지로 리다이렉트
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
