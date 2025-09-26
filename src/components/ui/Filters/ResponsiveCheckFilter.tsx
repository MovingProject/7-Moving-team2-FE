"use client";

import { useEffect, useState } from "react";
import CheckFilter from "./CheckFilter";
import CheckFilterTabs from "./CheckFilterTabs";

interface ResponsiveCheckFilterProps {
  filters: {
    key: string;
    title: string;
    options: { label: string; value: string }[];
    selected: string[];
    onToggle: (value: string) => void;
  }[];
  breakpoint?: number; // 기본: lg (1024px)
}

export default function ResponsiveCheckFilter({
  filters,
  breakpoint = 1023,
}: ResponsiveCheckFilterProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const handler = () => setIsMobile(media.matches);
    handler();
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, [breakpoint]);

  return (
    <>
      {isMobile ? (
        // 모바일/태블릿일 때 탭 전환
        <CheckFilterTabs filters={filters} />
      ) : (
        // 데스크탑
        <div className="flex flex-col gap-6">
          {filters.map((f) => (
            <CheckFilter
              key={f.key}
              title={f.title}
              options={f.options}
              selected={f.selected}
              onToggle={f.onToggle}
            />
          ))}
        </div>
      )}
    </>
  );
}
