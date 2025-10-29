"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useLikeDriver } from "@/utils/hook/likes/useLikeQuery";
import { useUnlikeDriver } from "@/utils/hook/likes/useUnlike";
import { useAuthStore } from "@/store/authStore";
import DefaultModal from "./Modal/DefaultModal";
import { useRouter } from "next/navigation";

export interface LikeButtonProps {
  driverId?: string;
  isLiked?: boolean;
  count?: number;
  readOnly?: boolean;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function LikeButton({
  driverId,
  isLiked = false,
  count: initialCount = 0,
  readOnly,
  className,
  onClick,
}: LikeButtonProps) {
  const router = useRouter();
  const { user } = useAuthStore();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [liked, setLiked] = useState(isLiked);
  const [count, setCount] = useState(initialCount);
  const { mutate: likeDriver } = useLikeDriver();
  const { mutate: unlikeDriver } = useUnlikeDriver();

  const toggleLike = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // 상세 페이지로 이동 방지

    if (readOnly) return; // 읽기 전용이면 클릭 불가

    // 외부 onClick 있으면 그거 우선 실행
    if (onClick) {
      onClick(e);
      return;
    }

    if (!user) {
      setShowLoginModal(true);
      return;
    }

    // 내부 토글 로직
    if (!driverId) {
      console.warn("LikeButton: driverId가 없습니다. 내부 토글만 실행됩니다.");
      setLiked((prev) => !prev);
      setCount((prev) => (liked ? prev - 1 : prev + 1));
      return;
    }

    if (liked) {
      setLiked(false);
      setCount((prev) => Math.max(0, prev - 1));
      unlikeDriver(driverId, {
        onError: () => {
          setLiked(true);
          setCount((prev) => prev + 1);
        },
      });
    } else {
      setLiked(true);
      setCount((prev) => prev + 1);
      likeDriver(driverId, {
        onError: () => {
          setLiked(false);
          setCount((prev) => Math.max(0, prev - 1));
        },
      });
    }
  };

  useEffect(() => {
    const handler = () => setIsDesktop(window.innerWidth >= 1024);
    handler();
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  useEffect(() => {
    setLiked(isLiked);
    setCount(initialCount);
  }, [isLiked, initialCount]);

  return (
    <>
      <button
        onClick={toggleLike}
        disabled={readOnly}
        className={`flex cursor-pointer items-center gap-1 focus:outline-none ${className}`}
      >
        <Image
          src={liked ? "/icon/like-on.svg" : "/icon/like-off.svg"}
          alt="좋아요"
          width={isDesktop ? 24 : 20}
          height={isDesktop ? 24 : 20}
        />
        <span className="text-xs text-gray-700 lg:text-base">{count}</span>
      </button>
      <DefaultModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        title="로그인이 필요한 작업입니다"
        buttonText="로그인하기"
        onButtonClick={() => router.push("/login")}
      >
        <p className="text-center text-gray-700">로그인 후에 이용하실 수 있습니다.</p>
      </DefaultModal>
    </>
  );
}
