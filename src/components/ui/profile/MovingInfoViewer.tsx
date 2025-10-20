"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
export interface MovingInfo {
  serviceTypes?: string[];
  serviceAreas?: string[];
  reviewCount?: number;
  rating?: number;
  careerYears?: number;
  confirmedCount?: number;
  moveAt?: string;
  price?: number;
  departureAddress?: string;
  arrivalAddress?: string;
}
export interface MovingInfoViewerProps {
  info: MovingInfo;
  infoType?: "driverService" | "review" | "estimate" | "route";
}

export default function MovingInfoViewer({ info, infoType = "review" }: MovingInfoViewerProps) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handler = () => setIsDesktop(window.innerWidth >= 1024);
    handler();
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  switch (infoType) {
    case "driverService":
      return (
        <div className="flex flex-col gap-x-4 gap-y-2 text-xs md:flex-row md:divide-x md:divide-gray-300 lg:gap-x-6 lg:text-base">
          <dl className="flex items-center gap-2 pr-2.5 lg:pr-6">
            <dt className="rounded border border-gray-300 bg-gray-100 px-2 py-0.5 text-gray-500">
              제공 서비스
            </dt>
            <dd className="flex gap-1.5 text-gray-800">{info.serviceTypes?.join(", ")}</dd>
          </dl>
          <dl className="flex items-center gap-2">
            <dt className="rounded border border-gray-300 bg-gray-100 px-2 py-0.5 text-gray-500">
              지역
            </dt>
            <dd className="flex gap-1.5 text-gray-800">{info.serviceAreas?.join(", ")}</dd>
          </dl>
        </div>
      );
    case "review":
      return (
        <div className="flex items-center gap-2.5 text-xs lg:gap-4 lg:text-base">
          <dl className="flex items-center gap-2">
            <dt className="sr-only text-gray-500">별점</dt>
            <dd className="flex items-center gap-1 text-gray-800">
              <Image
                src="/icon/star.svg"
                alt="별점"
                width={isDesktop ? 24 : 20}
                height={isDesktop ? 24 : 20}
              />
              <span>{info.rating ?? 0}</span>
              <span className="text-gray-500">({info.reviewCount ?? 0})</span>
            </dd>
          </dl>
          <dl className="flex items-center gap-2">
            <dt className="text-gray-500">경력</dt>
            <dd className="flex gap-2 text-gray-800">
              <span>{info.careerYears ?? 0}</span>
            </dd>
          </dl>
          <dl className="flex items-center gap-2">
            <dt className="sr-only text-gray-500">거래</dt>
            <dd className="flex gap-1 text-gray-800">
              <span className="flex gap-0.5">{info.confirmedCount ?? 0}건</span>
              <span className="text-gray-500">확정</span>
            </dd>
          </dl>
        </div>
      );
    case "estimate":
      return (
        <div className="flex flex-wrap gap-x-4 gap-y-2 divide-x divide-gray-300 text-xs lg:gap-x-6 lg:text-base">
          <dl className="flex items-center gap-2 pr-2.5 lg:pr-6">
            <dt className="text-gray-500">이사일</dt>
            <dd className="flex gap-2 text-gray-800">
              <span>{info.moveAt ?? "-"}</span>
            </dd>
          </dl>
          <dl className="flex items-center gap-2">
            <dt className="text-gray-500">견적가</dt>
            <dd className="text-gray-800">
              <span>{info.price ? `${info.price.toLocaleString()}원` : "-"}</span>
            </dd>
          </dl>
        </div>
      );
    case "route":
      return (
        <div className="flex flex-col gap-2 text-xs lg:flex-row lg:gap-6 lg:divide-x lg:divide-gray-300 lg:text-base">
          <dl className="flex items-center gap-2 lg:pr-6">
            <dt className="rounded bg-gray-100 px-2 py-0.5 text-gray-500">이사일</dt>
            <dd className="flex gap-2 text-gray-800">
              <span>{info.moveAt ?? "-"}</span>
            </dd>
          </dl>
          <div className="flex items-center gap-2.5 divide-x divide-gray-300 lg:gap-6">
            <dl className="flex items-center gap-2 pr-2.5 lg:pr-6">
              <dt className="rounded bg-gray-100 px-2 py-0.5 text-gray-500">출발지</dt>
              <dd className="flex gap-2 text-gray-800">
                <span>{info.departureAddress ?? "-"}</span>
              </dd>
            </dl>
            <dl className="flex items-center gap-2">
              <dt className="rounded bg-gray-100 px-2 py-0.5 text-gray-500">도착지</dt>
              <dd className="flex gap-2 text-gray-800">
                <span>{info.arrivalAddress ?? "-"}</span>
              </dd>
            </dl>
          </div>
        </div>
      );
    default:
      return null;
  }
}
