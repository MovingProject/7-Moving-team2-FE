import Script from "next/script";
import NavProvider from "@/components/layout/NavProvider";
import "../styles/globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "무빙 | 자유롭게 소통하는 너와 나의 이사 플랫폼",
  description: "고객님과 기사님을 연결하는 스마트 이사 서비스, 무빙에서 자유롭게 얘기해 보세요.",
  metadataBase: new URL("https://7-moving-team2-fe.vercel.app"),
  icons: {
    icon: [{ url: "/favicon.ico", type: "image/x-icon" }],
    apple: "/favicon.ico",
  },
  openGraph: {
    title: "무빙 | 자유롭게 소통하는 너와 나의 이사 플랫폼",
    description: "고객님과 기사님을 연결하는 스마트 이사 서비스, 무빙에서 자유롭게 얘기해 보세요.",
    url: "https://7-moving-team2-fe.vercel.app",
    siteName: "무빙",
    images: [
      {
        url: "https://7-moving-team2-fe.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "무빙 미리보기",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <NavProvider>{children}</NavProvider>
        <Script
          src="https://developers.kakao.com/sdk/js/kakao.min.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
