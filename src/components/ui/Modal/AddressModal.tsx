"use client";

import { useEffect, useState } from "react";
import Modal from "./Modal";
import AddressCard from "./AddressCard";
import Input from "../Input";
import Button from "../Button";

// 주소 타입 정의(주소 타입 다른 데 사용될 수 있어 export)
export interface Address {
  zipCode: string;
  roadAddr: string;
  lotAddr?: string;
}

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAddress: (address: Address) => void;
  fetchAddresses?: (query: string) => Promise<Address[]>;
  // 외부에서 API 함수 주입 (없으면 mock fallback 사용)
}

// fallback mock
const MOCK_ADDRESSES: Address[] = [
  {
    zipCode: "04538",
    roadAddr: "서울 중구 삼일대로 343 (대신파이낸스센터)",
    lotAddr: "서울 중구 저동1가 114",
  },
];

export default function AddressModal({
  isOpen,
  onClose,
  onSelectAddress,
  fetchAddresses,
}: AddressModalProps) {
  const [query, setQuery] = useState("");
  const [addresses, setAddresses] = useState<Address[]>(MOCK_ADDRESSES);
  const [selected, setSelected] = useState<Address | null>(null);
  const [device, setDevice] = useState<"mobile" | "desktop">("desktop");
  const [loading, setLoading] = useState(false);

  // 반응형 디바이스 체크
  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      if (width < 1024) setDevice("mobile");
      else setDevice("desktop");
    };
    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  // 검색 쿼리 변경 시 주소 데이터 가져오기
  useEffect(() => {
    let active = true; // race condition 방지

    const fetchData = async () => {
      if (!query) {
        // 쿼리 없을 때는 mock fallback
        setAddresses(MOCK_ADDRESSES);
        return;
      }

      if (fetchAddresses) {
        setLoading(true);
        try {
          const result = await fetchAddresses(query);
          if (active) setAddresses(result);
        } catch (err) {
          console.error("주소 검색 실패:", err);
          if (active) setAddresses([]);
        } finally {
          if (active) setLoading(false);
        }
      } else {
        // fallback: mock에서 검색
        const filtered = MOCK_ADDRESSES.filter(
          (addr) =>
            addr.roadAddr.includes(query) ||
            addr.lotAddr?.includes(query) ||
            addr.zipCode.includes(query)
        );
        setAddresses(filtered);
      }
    };

    fetchData();
    return () => {
      active = false;
    };
  }, [query, fetchAddresses]);

  if (!isOpen) return null;

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
          onChange={(value) => setQuery(value)}
          icon="right"
          className="w-full lg:w-[560px]"
        />
      </div>

      {/* 주소 리스트 */}
      <div className="space-y-2">
        {loading ? (
          <p className="text-gray-400">검색 중...</p>
        ) : addresses.length > 0 ? (
          addresses.map((addr) => (
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
