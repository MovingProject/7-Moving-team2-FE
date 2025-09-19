import clsx from "clsx";

// 버튼용 로딩 스피너
interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "w-6 h-6",
  md: "w-8 h-8",
  lg: "w-10 h-10",
};

export default function ButtonSpinner({ size = "md", className }: SpinnerProps) {
  // r = 10 → 둘레 ≈ 62.8
  // 보이는 길이 18, 공백 62.8 - 18 ≈ 44.8
  return (
    <svg className={clsx(sizeMap[size], className)} viewBox="0 0 24 24" aria-hidden="true">
      {/* 바깥 회색 트랙 (고정) */}
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        className="opacity-25"
        fill="none"
      />

      {/* 안쪽 회전체 (짧은 호만 보이게) */}
      <g className="animate-spin" style={{ transformOrigin: "center", transformBox: "fill-box" }}>
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="18 44.8"
        />
      </g>
    </svg>
  );
}
