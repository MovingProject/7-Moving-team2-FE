import Image from "next/image";
import clsx from "clsx";
import { useCard } from "../card/CardContext";

export interface LocalServiceInfo {
  type: "localservice";
  services?: string[];
  locals?: string[];
}

export interface ReviewInfo {
  type: "review";
  rating: number;
  career: number;
  deals: number;
}

export interface EstimateInfo {
  type: "estimate";
  date: string;
  price?: number;
}

export interface RouteInfo {
  type: "route";
  date: string;
  departure: string;
  destination: string;
}

// export type MovingInfo = LocalServiceInfo | ReviewInfo | EstimateInfo | RouteInfo;
export interface MovingInfo {
  services?: string[];
  locals?: string[];
  rating?: number;
  career?: number;
  deals?: number;
  date?: string;
  price?: number;
  departure?: string;
  destination?: string;
}
export interface MovingInfoViewerProps {
  info: MovingInfo;
  infoType?: "localservice" | "review" | "estimate" | "route";
}

export default function MovingInfoViewer({ info, infoType = "review" }: MovingInfoViewerProps) {
  const { layoutSize: contextLayoutSize, size: contextSize } = useCard();
  const layoutClasses = ["sm", "md"].includes(contextLayoutSize) ? "flex-col gap-2" : "gap-6";

  switch (infoType) {
    case "localservice":
      return (
        <div className={clsx("flex", layoutClasses)}>
          <dl className="flex gap-2 text-sm">
            <dt className="flex rounded-sm bg-gray-100 text-gray-500">제공 서비스</dt>
            <dd className="flex gap-1.5 text-gray-800">
              {info.services?.map((service) => (
                <span key={service}>{service}</span>
              ))}
            </dd>
          </dl>
          <dl className="flex gap-2 text-sm">
            <dt className="text-gray-500">지역</dt>
            <dd className="flex gap-1.5 text-gray-800">
              {info.locals?.map((local) => (
                <span key={local}>{local}</span>
              ))}
            </dd>
          </dl>
        </div>
      );
    case "review":
      return (
        <div className="flex gap-4 text-sm">
          <dl className="flex gap-2">
            <dt className="text-gray-500">
              <Image
                src="/icon/star.svg"
                alt="별점"
                width={contextSize === "sm" || contextSize === "md" ? 20 : 24}
                height={contextSize === "sm" || contextSize === "md" ? 20 : 24}
              />
              <span className="sr-only">별점</span>
            </dt>
            <dd className="flex gap-2 text-gray-800">
              <span>{info.rating ?? 0}점</span>
            </dd>
          </dl>
          <dl className="flex gap-2">
            <dt className="text-gray-500">경력</dt>
            <dd className="flex gap-2 text-gray-800">
              <span>{info.career ?? 0}년</span>
            </dd>
          </dl>
          <dl className="flex gap-2">
            <dt className="text-gray-500">거래</dt>
            <dd className="flex gap-2 text-gray-800">
              <span>{info.deals ?? 0}건</span>
            </dd>
          </dl>
        </div>
      );
    case "estimate":
      return (
        <div className={clsx("flex gap-4 text-sm", layoutClasses)}>
          <dl className="flex gap-2">
            <dt className="text-gray-500">이사일</dt>
            <dd className="flex gap-2 text-gray-800">
              <span>{info.date ?? "-"}</span>
            </dd>
          </dl>
          <dl className="flex gap-2">
            <dt className="text-gray-500">견적가</dt>
            <dd className="flex gap-2 text-gray-800">
              <span>{info.price ? `${info.price.toLocaleString()}원` : "-"}</span>
            </dd>
          </dl>
        </div>
      );
    case "route":
      return (
        <div className={clsx("flex gap-4 text-sm", layoutClasses)}>
          <dl className="flex gap-2">
            <dt className="text-gray-500">이사일</dt>
            <dd className="flex gap-2 text-gray-800">
              <span>{info.date ?? "-"}</span>
            </dd>
          </dl>
          <dl className="flex gap-2">
            <dt className="text-gray-500">출발지</dt>
            <dd className="flex gap-2 text-gray-800">
              <span>{info.departure ?? "-"}</span>
            </dd>
          </dl>
          <dl className="flex gap-2">
            <dt className="text-gray-500">도착지</dt>
            <dd className="flex gap-2 text-gray-800">
              <span>{info.destination ?? "-"}</span>
            </dd>
          </dl>
        </div>
      );
    default:
      return null;
  }
}
