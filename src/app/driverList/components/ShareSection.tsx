"use client";

import Image from "next/image";
import { useEffect, useState, Dispatch, SetStateAction } from "react";
import LinkBox from "@/assets/icon/LinkBox.svg";
import KakaoBox from "@/assets/icon/KakaoBox.svg";
import FacebookBox from "@/assets/icon/FacebookBox.svg";

interface ShareSectionProps {
  setPopup: Dispatch<SetStateAction<{ type: "info" | "warning"; message: string } | null>>;
}

export default function ShareSection({ setPopup }: ShareSectionProps) {
  // Kakao SDK 안전 초기화
  useEffect(() => {
    const kakao = window.Kakao;
    if (!kakao) {
      console.warn("Kakao SDK not loaded yet");
      return;
    }

    const key = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;
    if (!key) {
      console.error("Kakao key is missing! Check .env.local");
      return;
    }

    if (!kakao.isInitialized()) {
      kakao.init(key);
      console.log("Kakao SDK initialized");
    }
  }, []);

  // 링크 복사
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setPopup({ type: "info", message: "링크가 복사되었어요!" });
    } catch {
      setPopup({ type: "warning", message: "링크 복사에 실패했습니다" });
    }
  };

  // 카카오톡 공유
  const handleShareKakao = () => {
    const kakao = window.Kakao;
    if (!kakao) {
      setPopup({ type: "warning", message: "카카오톡 공유 기능을 사용할 수 없습니다." });
      return;
    }

    if (!kakao.isInitialized()) {
      const key = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;
      if (!key) {
        setPopup({ type: "warning", message: "카카오 키가 설정되어 있지 않습니다." });
        return;
      }
      kakao.init(key);
    }

    kakao.Link.sendDefault({
      objectType: "feed",
      content: {
        title: "이 기사님 정말 추천해요 🚛",
        description: "Moving에서 만난 최고의 기사님입니다!",
        imageUrl: `${window.location.origin}/og-image.png`,
        link: {
          mobileWebUrl: window.location.href,
          webUrl: window.location.href,
        },
      },
      buttons: [
        {
          title: "기사님 보러가기",
          link: {
            mobileWebUrl: window.location.href,
            webUrl: window.location.href,
          },
        },
      ],
    });
  };

  // 페이스북 공유
  const handleShareFacebook = () => {
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      window.location.href
    )}`;
    window.open(shareUrl, "_blank", "width=600,height=500");
  };

  return (
    <div className="relative flex flex-col gap-6 lg:p-6">
      <p className="text-lg font-semibold text-gray-800">나만 알기 아쉬운 기사님인가요?</p>

      {/* 아이콘 버튼 그룹 */}
      <div className="flex items-center gap-3">
        {/* 링크 복사 */}
        <button
          onClick={handleCopyLink}
          className="flex h-11 w-11 cursor-pointer items-center justify-center"
        >
          <Image src={LinkBox} alt="링크 복사" width={44} height={44} />
        </button>

        {/* 카카오톡 공유 */}
        <button
          onClick={handleShareKakao}
          className="flex h-11 w-11 cursor-pointer items-center justify-center"
        >
          <Image src={KakaoBox} alt="카카오톡 공유" width={44} height={44} />
        </button>

        {/* 페이스북 공유 */}
        <button
          onClick={handleShareFacebook}
          className="flex h-11 w-11 cursor-pointer items-center justify-center"
        >
          <Image src={FacebookBox} alt="페이스북 공유" width={44} height={44} />
        </button>
      </div>
    </div>
  );
}
