import Image from "next/image";
import ArrowIconLeft from "@/assets/icon/ArrowIconLeft.svg";
import ArrowIconRight from "@/assets/icon/ArrowIconRight.svg";

interface PaginationProps {
  hasNext: boolean;
  hasPrev: boolean;
  onNext: () => void;
  onPrev: () => void;
}

export default function Pagination({ hasNext, hasPrev, onNext, onPrev }: PaginationProps) {
  return (
    <div className="mt-6 flex justify-center gap-4">
      {/* 이전 버튼 */}
      <button
        onClick={onPrev}
        disabled={!hasPrev}
        className={`flex items-center gap-2 text-sm ${
          !hasPrev ? "cursor-not-allowed text-gray-300" : "text-gray-700 hover:text-gray-900"
        }`}
      >
        <Image src={ArrowIconLeft} alt="이전" width={20} height={20} />
        이전
      </button>

      {/* 다음 버튼 */}
      <button
        onClick={onNext}
        disabled={!hasNext}
        className={`flex items-center gap-2 text-sm ${
          !hasNext ? "cursor-not-allowed text-gray-300" : "text-gray-700 hover:text-gray-900"
        }`}
      >
        다음
        <Image src={ArrowIconRight} alt="다음" width={20} height={20} />
      </button>
    </div>
  );
}
