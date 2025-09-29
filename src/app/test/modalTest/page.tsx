"use client";

import { useState, useEffect } from "react";
import DefaultModal from "@/components/ui/Modal/DefaultModal";
import AddressModal from "@/components/ui/Modal/AddressModal";
import type { Address } from "@/components/ui/Modal/AddressModal";
import PostModal from "@/components/ui/Modal/PostModal";
import FilterContainer from "@/components/ui/Modal/FilterContainer";

export default function ModalTest() {
  const [open, setOpen] = useState<null | string>(null);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    if (selectedAddress) {
      console.log("선택된 주소:", selectedAddress);
    }
  }, [selectedAddress]);

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
      <div className="mt-10">
        <div>
          {/* 원하는 위치에 버튼 배치, 1024px에서는 버튼 사라지고 필터만 */}
          <button
            className="rounded bg-green-500 px-4 py-2 text-white lg:hidden"
            onClick={() => setFilterOpen(true)}
          >
            필터 열기
          </button>

          {/* 필터 컨테이너 */}
          <FilterContainer isOpen={filterOpen} onClose={() => setFilterOpen(false)} />
        </div>
      </div>

      <PostModal
        isOpen={open === "review"}
        onClose={() => setOpen(null)}
        type="review"
        driver={{
          name: "김코드",
          image: "/images/avatars/avatartion3.jpg",
          movingDate: "2024.07.01",
          estimatePrice: "210,000원",
        }}
      />
      <PostModal
        isOpen={open === "reject"}
        onClose={() => setOpen(null)}
        type="reject"
        rejectInfo={{
          consumerName: "홍길동",
          movingDate: "2024.07.01(월)",
          departure: "서울시 중구",
          arrival: "경기도 수원시",
        }}
      />
      <AddressModal
        isOpen={open === "address"}
        onClose={() => setOpen(null)}
        onSelectAddress={(addr) => setSelectedAddress(addr)}
      />
      <DefaultModal
        isOpen={open === "default"}
        onClose={() => setOpen(null)}
        title="지정 견적 요청하기"
        buttonText="일반 견적 요청 하기"
        onButtonClick={() => {
          setOpen(null);
        }}
      >
        <p className="text-[16px]">일반 견적 요청을 먼저 진행해 주세요.</p>
      </DefaultModal>
    </div>
  );
}
