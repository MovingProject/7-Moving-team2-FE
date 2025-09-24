"use client";

import Button from "@/components/ui/Button";

export default function ProfileSection() {
  // TODO: API 연동 시 유저 데이터 받아오기
  const user = {
    name: "김코드",
    description: "고객님의 물품을 소중하고 안전하게 운송하여 드립니다.",
    rating: 5.0,
    reviewCount: 178,
    career: "7년",
    matched: 343,
    services: ["포장이사", "소형이사", "가전이사"],
    region: ["서울", "경기"],
  };

  return (
    <section className="bg-[#FAFAFA]] rounded-2xl border-1 border-[#DEDEDE] p-6">
      {/* 프로필 카드 (팀원 컴포넌트 자리) */}
      <div>
        <p>카드 컴포넌트 import해서 쓸 예정</p>
      </div>
      {/* 버튼 영역 */}
      <div className="mt-4 flex justify-end gap-2">
        <Button text="기본 정보 수정" variant="secondary" size="sm" radius="default" />
        <Button text="내 프로필 수정" variant="primary" size="sm" radius="default" />
      </div>
    </section>
  );
}
