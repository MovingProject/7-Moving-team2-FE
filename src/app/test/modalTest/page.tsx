"use client";

import { useState } from "react";
import { DefaultModal } from "@/components/ui/Modal/Modals";
import { AddressModal } from "@/components/ui/Modal/AddressModal";
import { PostModal } from "@/components/ui/Modal/PostModal";
import FilterContainer from "@/components/ui/Modal/FilterContainer";

export default function ModalTest() {
  const [open, setOpen] = useState<null | string>(null);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);

  return (
    <div className="space-y-6 p-10">
      <h2 className="text-lg font-semibold">모달 테스트</h2>

      {/* 버튼들 */}
      <div className="flex flex-wrap gap-4">
        <button
          className="rounded bg-blue-500 px-4 py-2 text-white"
          onClick={() => setOpen("review")}
        >
          PostModal-review 열기
        </button>
        <button
          className="rounded bg-blue-500 px-4 py-2 text-white"
          onClick={() => setOpen("reject")}
        >
          PostModal-reject 열기
        </button>

        <button
          className="rounded bg-purple-500 px-4 py-2 text-white"
          onClick={() => setOpen("address")}
        >
          AddressModal 열기
        </button>
        <button
          className="rounded bg-gray-600 px-4 py-2 text-white"
          onClick={() => setOpen("default")}
        >
          DefaultModal 열기
        </button>
      </div>

      <PostModal
        isOpen={open === "review"}
        onClose={() => setOpen(null)}
        type="review"
        technician={{
          name: "김코드",
          profileImageUrl: "/images/avatars/avatartion3.jpg",
          movingDate: "2024.07.01",
          estimatePrice: "210,000원",
        }}
      />
      <PostModal
        isOpen={open === "reject"}
        onClose={() => setOpen(null)}
        type="reject"
        rejectInfo={{
          customerName: "홍길동",
          movingDate: "2024.07.01(월)",
          departure: "서울시 중구",
          arrival: "경기도 수원시",
        }}
      />
      <FilterContainer />
      <AddressModal
        isOpen={open === "address"}
        onClose={() => setOpen(null)}
        onSelectAddress={(addr) => setSelectedAddress(addr)}
      />
      <DefaultModal isOpen={open === "default"} onClose={() => setOpen(null)} />
    </div>
  );
}
