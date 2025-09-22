"use client";

import { useState } from "react";
import { PostModal, FilterModal, AddressModal, DefaultModal } from "@/components/ui/Modal/Modals";

export default function ModalTest() {
  const [open, setOpen] = useState<null | string>(null);

  return (
    <div className="space-y-6 p-10">
      <h2 className="text-lg font-semibold">모달 테스트</h2>

      {/* 버튼들 */}
      <div className="flex flex-wrap gap-4">
        <button
          className="rounded bg-blue-500 px-4 py-2 text-white"
          onClick={() => setOpen("post")}
        >
          PostModal 열기
        </button>
        <button
          className="rounded bg-green-500 px-4 py-2 text-white"
          onClick={() => setOpen("filter")}
        >
          FilterModal 열기
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

      {/* 실제 모달 */}
      <PostModal isOpen={open === "post"} onClose={() => setOpen(null)} />
      <FilterModal isOpen={open === "filter"} onClose={() => setOpen(null)} />
      <AddressModal isOpen={open === "address"} onClose={() => setOpen(null)} />
      <DefaultModal isOpen={open === "default"} onClose={() => setOpen(null)} />
    </div>
  );
}
