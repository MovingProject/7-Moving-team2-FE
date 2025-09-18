"use client";

import { useState } from "react";
import { RegionFilter, ServiceFilter, SortFilter } from "@/components/ui/Filters/Filters";

export default function TestPage() {
  const [region, setRegion] = useState("지역");
  const [service, setService] = useState("서비스");
  const [sort, setSort] = useState("리뷰 많은 순");

  return (
    <div className="space-y-4 p-6">
      <h1 className="text-xl font-bold">필터 테스트 페이지</h1>

      <div className="flex flex-wrap gap-20">
        <RegionFilter selected={region} onChange={setRegion} />
        <ServiceFilter selected={service} onChange={setService} />
        <SortFilter selected={sort} onChange={setSort} />
      </div>

      <div className="mt-6 space-y-2">
        <p>선택된 지역: {region}</p>
        <p>선택된 서비스: {service}</p>
        <p>선택된 정렬: {sort}</p>
      </div>
    </div>
  );
}
