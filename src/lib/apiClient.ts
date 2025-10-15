import axios from "axios";
import { useAuthStore } from "@/store/authStore";

const apiClient = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
  // 304 Not Modified 는 캐시 사용 신호이므로 reject 되지 않도록 허용
  validateStatus: (status) => (status >= 200 && status < 300) || status === 304,
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

        // user는 localStorage에서 자동 복원
        // refresh 성공했으니 원래 요청 재시도
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error("[인터셉터] refresh 실패 → 로그아웃");
        // refresh도 실패하면 완전히 로그아웃
        const { clearUser } = useAuthStore.getState();
        clearUser();

        // 리다이렉트 제거 또는 조건 추가
        // 이미 로그인 페이지면 리다이렉트 안 함
        if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
