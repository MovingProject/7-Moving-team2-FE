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
      {/* 프로필 카드 */}
      <div>
        <p>카드 컴포넌트 import해서 쓸 예정</p>
      </div>
    </section>
  );
}
