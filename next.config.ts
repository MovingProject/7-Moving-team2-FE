import type { NextConfig } from "next";

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
        destination: "http://localhost:4000/:path*", // 실제 백엔드 서버
      },
    ];
  },
};

export default nextConfig;
