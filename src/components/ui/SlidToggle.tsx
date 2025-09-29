import { KeyboardEvent } from "react";

type Value = "user" | "pro";
type Props = {
  value: Value;
  onChange: (v: Value) => void;
  leftLabel?: string;
  rightLabel?: string;
  userColorClassName?: string; // 고객님 배경
  proColorClassName?: string; // 기사님 배경
};

export default function SlidToggle({
  value,
  onChange,
  leftLabel = "고객님",
  rightLabel = "기사님",
  userColorClassName = "bg-blue-500",
  proColorClassName = "bg-amber-400",
}: Props) {
  const isUser = value === "user";
  const handleToggle = () => onChange(isUser ? "pro" : "user");
  const onKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleToggle();
    }
    if (e.key === "ArrowLeft") onChange("user");
    if (e.key === "ArrowRight") onChange("pro");
  };

  return (
    <div className="relative inline-block">
      <button
        type="button"
        role="switch"
        aria-checked={isUser}
        onClick={handleToggle}
        onKeyDown={onKey}
        className={[
          // 컨테이너
          "relative h-12 w-[320px] overflow-hidden rounded-full p-1",
          "shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)]",
          isUser ? userColorClassName : proColorClassName,
          // 애니메이션 (조금 흐르는 느낌의 베지어)
          "transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-black/10",
        ].join(" ")}
      >
        {/* 라벨 레이어 */}
        <div className="relative z-10 grid h-full grid-cols-2 text-sm font-semibold tracking-wide select-none">
          <span
            className={[
              "flex items-center justify-center",
              isUser ? "text-black" : "text-black/50",
            ].join(" ")}
          >
            {leftLabel}
          </span>
          <span
            className={[
              "flex items-center justify-center",
              !isUser ? "text-black" : "text-black/50",
            ].join(" ")}
          >
            {rightLabel}
          </span>
        </div>

        {/* 썸(슬라이더) — 좌/우 대칭 정렬 */}
        <div
          aria-hidden
          className={[
            "absolute top-1 bottom-1 left-1",
            // 썸 너비를 절반보다 4px 작게 (컨테이너 패딩 고려)
            "w-[calc(50%-4px)] rounded-full bg-white shadow",
            // 위치 전환
            isUser ? "translate-x-0" : "translate-x-full",
            // 애니메이션
            "transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          ].join(" ")}
        />
      </button>

      {/* 각 영역 직접 클릭도 가능하게 히트영역 분리 */}
      <div className="pointer-events-none absolute inset-0 grid grid-cols-2">
        <button
          type="button"
          className="pointer-events-auto"
          onClick={() => onChange("user")}
          aria-label={`${leftLabel} 선택`}
        />
        <button
          type="button"
          className="pointer-events-auto"
          onClick={() => onChange("pro")}
          aria-label={`${rightLabel} 선택`}
        />
      </div>
    </div>
  );
}
