import React from "react";
import clsx from "clsx";

declare global {
  interface Window {
    daum: any;
  }
}

interface AddressInputGroupProps {
  baseAddress: string;
  detailAddress: string;

  // 주소 상태를 업데이트하는 함수
  onBaseAddressChange: (newBaseAddress: string) => void;
  onDetailAddressChange: (newDetailAddress: string) => void;

  // 포커스 제어를 위한 Ref
  detailAddressRef: React.RefObject<HTMLInputElement | null>;
}

const AddressInputGroup: React.FC<AddressInputGroupProps> = ({
  baseAddress,
  detailAddress,
  onBaseAddressChange,
  onDetailAddressChange,
  detailAddressRef,
}) => {
  // --- 카카오 주소 검색 로직 (컴포넌트 내부에서만 사용) ---
  const handleAddressSearch = () => {
    if (typeof window.daum === "undefined" || !window.daum.Postcode) {
      alert("주소 검색 라이브러리 로딩 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    new window.daum.Postcode({
      oncomplete: function (data: any) {
        let newBaseAddress = data.roadAddress || data.jibunAddress;

        onBaseAddressChange(newBaseAddress);
        onDetailAddressChange(""); // 주소 변경 시, 상세 주소 초기화

        setTimeout(() => {
          detailAddressRef.current?.focus();
        }, 100);
      },
    }).open();
  };
  // --- END 카카오 주소 검색 로직 ---

  return (
    <div className="flex flex-col gap-1">
      <label className="mb-1 block text-sm font-medium text-gray-700">주소</label>

      {/* 기본 주소 표시 div */}
      <div
        className={clsx(
          "flex h-[64px] w-full cursor-pointer items-center rounded-lg border border-gray-300 px-4 text-gray-500 outline-none",
          {
            "border-gray-300 bg-gray-100 text-gray-900": baseAddress,
          }
        )}
        onClick={handleAddressSearch}
      >
        {baseAddress ? baseAddress : "우편번호 주소를 검색해주세요."}
      </div>

      {/* 기본 주소가 있을 때만 상세주소 표시 */}
      {baseAddress && (
        <input
          type="text"
          value={detailAddress}
          ref={detailAddressRef}
          onChange={(e) => onDetailAddressChange(e.target.value)}
          placeholder="상세 주소 (예: A동 101호)를 입력해 주세요."
          className="mt-2 h-[64px] w-full rounded-lg border border-gray-300 px-4 outline-none"
        />
      )}
    </div>
  );
};

export default AddressInputGroup;
