import { useAuthStore } from "@/store/authStore";
import axios from "axios";

const apiClient = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
  // 304 Not Modified 는 캐시 사용 신호이므로 reject 되지 않도록 허용
  validateStatus: (status) => (status >= 200 && status < 300) || status === 304,
});

// 요청 인터셉터
apiClient.interceptors.request.use(
  (config) => {
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
    const status = error.response?.status;
    const responseData = error.response?.data;
    const message = responseData?.message || "";

    const publicEndpoints = [
      "/reviews/drivers", // 기사 리뷰 조회
      "/drivers", // 기사 상세
      "/landing", // 랜딩 관련
    ];

    const isPublicEndpoint = publicEndpoints.some((endpoint) =>
      originalRequest?.url?.startsWith(endpoint)
    );

    if (status === 500 && originalRequest?.url?.includes("/users/me")) {
      error._isProfileNotFound = true;
      return Promise.reject(error);
    }

    if (status === 401 && !originalRequest._retry) {
      // 공개 API면 refresh 시도 / 리다이렉트 X
      if (isPublicEndpoint) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        // refresh는 토큰 갱신만 (user 데이터 건드리지 않음)
        // 백엔드의 실제 경로로 직접 호출하여 쿠키 path와 일치시킴
        const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";
        await axios.post(`${backendUrl}/auth/refresh`, {}, { withCredentials: true });

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
