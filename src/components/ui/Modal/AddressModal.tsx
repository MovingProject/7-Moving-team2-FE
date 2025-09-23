"use client";

import { useEffect, useState } from "react";
import { Modal } from "./Modal";
import { AddressCard } from "./AddressCard";
import Input from "../Input";
import Button from "../Button";

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAddress: (address: { zipCode: string; roadAddr: string; lotAddr?: string }) => void;
}

const MOCK_ADDRESSES = [
  {
    zipCode: "04538",
    roadAddr: "서울 중구 삼일대로 343 (대신파이낸스센터)",
    lotAddr: "서울 중구 저동1가 114",
  },
];

export function AddressModal({ isOpen, onClose, onSelectAddress }: BaseModalProps) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<(typeof MOCK_ADDRESSES)[0] | null>(null);
  const [device, setDevice] = useState<"mobile" | "tablet" | "desktop">("desktop");

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      if (width < 1024)
        setDevice("mobile"); // mobile + tablet
      else setDevice("desktop");
    };
    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  if (!isOpen) return null;

  const filtered = MOCK_ADDRESSES.filter(
    (addr) =>
      addr.roadAddr.includes(query) || addr.lotAddr?.includes(query) || addr.zipCode.includes(query)
  );

  return (
    <Modal
      type="address"
      size={device === "desktop" ? "md" : "sm"}
      title="출발지를 선택해 주세요"
      onClose={onClose}
    >
      {/* 검색창 */}
      <div className="mb-4 flex items-center">
        <Input
          type="search"
          value={query}
          placeholder="텍스트를 입력해 주세요."
          onChange={(e) => setQuery(e.target.value)}
          icon="right"
          className="w-full lg:w-[560px]"
        />
      </div>

      {/* 주소 리스트 */}
      <div className="space-y-2">
        {filtered.length > 0 ? (
          filtered.map((addr) => (
            <AddressCard
              key={addr.roadAddr}
              zipCode={addr.zipCode}
              roadAddr={addr.roadAddr}
              lotAddr={addr.lotAddr}
              selected={selected?.roadAddr === addr.roadAddr}
              onSelect={() =>
                setSelected((prev) => (prev?.roadAddr === addr.roadAddr ? null : addr))
              }
            />
          ))
        ) : (
          <p className="text-gray-400">검색 결과가 없습니다.</p>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-6">
        <Button
          text="선택완료"
          variant="primary"
          size="md"
          radius="default"
          className="w-full"
          disabled={!selected} // 선택 안 하면 비활성화
          onClick={() => {
            if (selected) onSelectAddress(selected);
            onClose();
          }}
        />
      </footer>
    </Modal>
  );
}
