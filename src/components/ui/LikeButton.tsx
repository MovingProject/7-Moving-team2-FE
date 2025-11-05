"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { useLikeDriver } from "@/utils/hook/likes/useLikeQuery";
import { useUnlikeDriver } from "@/utils/hook/likes/useUnlike";
import { useLikedDriversQuery } from "@/utils/hook/likes/useLikedQuery";
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
  count = 0,
  readOnly,
  className,
  onClick,
}: LikeButtonProps) {
  const router = useRouter();
  const { user } = useAuthStore();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [liked, setLiked] = useState(isLiked);
  const [likeCount, setLikeCount] = useState(count);
  const { mutate: likeDriver } = useLikeDriver();
  const { mutate: unlikeDriver } = useUnlikeDriver();
  const { data: likedData } = useLikedDriversQuery();

  const isLikedFromServer = useMemo(() => {
    if (!likedData?.pages) return false;
    const likedList = likedData.pages.flatMap((p) => p.likedDriverList ?? []);
    return likedList.some((driver) => driver.id === driverId);
  }, [likedData, driverId]);

  const finalLiked = liked || isLikedFromServer;

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
      return;
    }

    if (finalLiked) {
      setLiked(false);
      setLikeCount((prev) => Math.max(0, prev - 1));
      unlikeDriver(driverId, {
        onError: () => {
          // 실패 시 복구
          setLiked(true);
          setLikeCount((prev) => prev + 1);
        },
      });
    } else {
      setLiked(true);
      setLikeCount((prev) => prev + 1);
      likeDriver(driverId, {
        onError: () => {
          // 실패 시 복구
          setLiked(false);
          setLikeCount((prev) => Math.max(0, prev - 1));
        },
      });
    }
  };
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setLiked(isLiked);
    setLikeCount(count);
  }, [isLiked, count]);

  return (
    <>
      <button
        onClick={toggleLike}
        disabled={readOnly}
        className={`flex items-center gap-1 focus:outline-none ${
          readOnly ? "cursor-default opacity-70" : "cursor-pointer"
        } ${className}`}
      >
        <Image
          src={finalLiked ? "/icon/like-on.svg" : "/icon/like-off.svg"}
          alt="좋아요"
          width={isDesktop ? 24 : 20}
          height={isDesktop ? 24 : 20}
        />
        <span className="text-xs text-gray-700 lg:text-base">{likeCount}</span>
      </button>
      <DefaultModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        title=""
        buttonText="로그인하기"
        onButtonClick={() => router.push("/login")}
      >
        <p className="text-center text-base text-gray-700 lg:text-xl">
          로그인 후에 이용하실 수 있습니다.
        </p>
      </DefaultModal>
    </>
  );
}
