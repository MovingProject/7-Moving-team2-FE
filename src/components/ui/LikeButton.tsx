"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export interface LikeButtonProps {
  isLiked?: boolean;
  count?: number;
  className?: string;
}

export default function LikeButton({
  isLiked = false,
  count: initialCount = 0,
  className,
}: LikeButtonProps) {
  const [isDesktop, setIsDesktop] = useState(false);
  const [liked, setLiked] = useState(isLiked);
  const [count, setCount] = useState(initialCount);

  const toggleLike = () => {
    if (liked) {
      setLiked(false);
      setCount((prev) => prev - 1);
    } else {
      setLiked(true);
      setCount((prev) => prev + 1);
    }

    // 이후에는 서버 연결 후 API 호출 필요
  };

  useEffect(() => {
    const handler = () => setIsDesktop(window.innerWidth >= 1024);
    handler();
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return (
    <button
      onClick={toggleLike}
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
  );
}
