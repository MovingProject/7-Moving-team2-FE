import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
const BACKEND_ORIGIN = isProd ? process.env.NEXT_PUBLIC_API_URL : "http://localhost:4000";

const nextConfig: NextConfig = {
  /* config options here */
  // 외부 이미지로 기본 프로필 이외의 이미지 출력 테스트용
  images: {
    domains: ["codeit-images.codeit.com"],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*", // 프론트에서 호출할 경로
        destination: `${BACKEND_ORIGIN}/:path*`, // 실제 백엔드 서버
      },
    ];
  },
};

export default nextConfig;
