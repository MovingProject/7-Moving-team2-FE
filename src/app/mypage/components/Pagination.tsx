import Image from "next/image";
import ArrowIconLeft from "@/assets/icon/ArrowIconLeft.svg";
import ArrowIconRight from "@/assets/icon/ArrowIconRight.svg";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  const maxVisible = 5;

  // 페이지 목록 계산
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= maxVisible) {
      // 전체 페이지 수가 작으면 다 보여줌
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      // 항상 첫 페이지
      pages.push(1);

      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);

      // 앞쪽에 ... 필요
      if (start > 2) {
        pages.push("...");
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // 뒤쪽에 ... 필요
      if (end < totalPages - 1) {
        pages.push("...");
      }

      // 항상 마지막 페이지
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="mt-6 flex justify-center gap-2">
      <button
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className="px-3 py-1 text-sm disabled:text-gray-300"
      >
        <Image src={ArrowIconLeft} alt="이전" width={24} height={24} className="cursor-pointer" />
      </button>

      {pageNumbers.map((p, idx) =>
        p === "..." ? (
          <span key={`ellipsis-${idx}`} className="px-2 text-gray-300">
            ...
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(Number(p))}
            className={`cursor-pointer px-3 py-1 text-sm ${
              p === page ? "font-semibold text-[#1F1F1F]" : "text-gray-300"
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        className="px-3 py-1 text-sm disabled:text-gray-300"
      >
        <Image src={ArrowIconRight} alt="다음" width={24} height={24} className="cursor-pointer" />
      </button>
    </div>
  );
}
