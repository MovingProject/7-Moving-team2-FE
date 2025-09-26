"use client";
// 버튼 테스트 및 로딩 지연(LoadingSpinner) 테스트

import Button from "@/components/ui/Button";
import { useState } from "react";

export default function TestPage() {
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
    // 2초 후 로딩 종료
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-20">
      {/* 기본 버튼 */}
      <Button />

      {/* 로딩 버튼 (오른쪽 스피너) */}
      <Button text="견적 제출하기" loading={loading} onClick={handleClick} />

      {/* 로딩 버튼 secondary 크기 조정 */}
      <Button
        text="견적 생각하기"
        variant="secondary"
        loading={loading}
        onClick={handleClick}
        className="w-[300px]"
      />

      {/* 로딩 버튼 (왼쪽 스피너) */}
      <Button text="신고하기" loading={loading} onClick={handleClick} showIcon />

      {/* 비활성 버튼 */}
      <Button text="비활성" disabled showIcon />
    </div>
  );
}
