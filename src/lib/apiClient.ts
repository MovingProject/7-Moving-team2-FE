import { useAuthStore } from "@/store/authStore";
import axios from "axios";

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
    const status = error.response?.status;
    const responseData = error.response?.data;
    const message = responseData?.message || "";

    console.log("[인터셉터] 에러 발생:", {
      status,
      url: originalRequest?.url,
      message,
      responseData,
      "responseData 타입": typeof responseData,
      "responseData 전체": JSON.stringify(responseData, null, 2),
    });

    const publicEndpoints = [
      "/reviews/drivers", // 기사 리뷰 조회
      "/drivers", // 기사 상세
      "/landing", // 랜딩 관련
    ];

    const isPublicEndpoint = publicEndpoints.some((endpoint) =>
      originalRequest?.url?.startsWith(endpoint)
    );

    if (status === 500 && originalRequest?.url?.includes("/users/me")) {
      console.log("[인터셉터] /users/me 500 에러 → 프로필 미등록 상태로 처리");
      error._isProfileNotFound = true;
      return Promise.reject(error);
    }

    if (status === 401 && !originalRequest._retry) {
      // 공개 API면 refresh 시도 / 리다이렉트 X
      if (isPublicEndpoint) {
        console.log(
          "[인터셉터] 공개 API 401 → refresh 시도/로그아웃 건너뜀:",
          originalRequest?.url
        );
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        console.log("[인터셉터] 401 발생 → refresh 시도");

        // refresh는 토큰 갱신만 (user 데이터 건드리지 않음)
        await axios.post("/api" + "/auth/refresh", {}, { withCredentials: true });

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
