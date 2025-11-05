import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // 외부 이미지로 기본 프로필 이외의 이미지 출력 테스트용
  images: {
    domains: ["codeit-images.codeit.com"],
  },
};

export default nextConfig;
