"use client";

import { useState } from "react";
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

  return (
    <button
      onClick={toggleLike}
      className={`flex cursor-pointer items-center gap-1 focus:outline-none ${className}`}
    >
      <Image
        src={liked ? "/icon/like-on.svg" : "/icon/like-off.svg"}
        alt="좋아요"
        width={24}
        height={24}
      />
      <span className="text-xs text-gray-700">{count}</span>
    </button>
  );
}
