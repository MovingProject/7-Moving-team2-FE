import clsx from "clsx";
import { UserData, RequestData, QuotationData } from "@/types/card";
import { ApiCustomerRequestWithQuotations } from "@/types/quotation";
import { MoveTypeMap, ServerMoveType } from "@/types/moveTypes";
import { formatDateToKr } from "@/utils/constant/formatDateToKr";
import OrderCard from "@/components/ui/card/OrderCard";
import { REQUEST_STATUS } from "@/types/statement";
import { QUOTATION_STATEMENT } from "@/types/statement";
interface ReceivedQuotationProps {
  requestInfo: ApiCustomerRequestWithQuotations;
  quotations?: {
    user: UserData;
    request: RequestData;
    quotation: QuotationData;
  }[];
  selectedSort?: string;
}

export default function QuotationArea({ requestInfo, quotations = [] }: ReceivedQuotationProps) {
  const serviceTypeDisplay = Array.isArray(requestInfo.serviceType)
    ? requestInfo.serviceType
        .map((typeKey: ServerMoveType) => MoveTypeMap[typeKey]?.content || typeKey)
        .join(", ")
    : MoveTypeMap[requestInfo.serviceType as ServerMoveType]?.content || requestInfo.serviceType;

  const formattedMoveDate = formatDateToKr(requestInfo.moveAt);
  const formattedCreatedAt = formatDateToKr(requestInfo.createdAt);

  const statusKey = requestInfo.requestStatus;
  const statusLabel = REQUEST_STATUS[statusKey].label;

  return (
    <div className="flex flex-col gap-10 rounded-2xl border border-gray-300 bg-white p-4 shadow-md lg:p-10">
      <div className="flex flex-col gap-4">
        <h3 className="text-base font-bold lg:text-2xl">견적 정보</h3>
        <div className="relative flex flex-col gap-2.5 rounded-xl bg-gray-100 p-4 lg:p-8">
          <dl className="flex gap-4">
            <dt className="w-[78px] text-gray-500">견적요청일</dt>
            <dd>{formattedCreatedAt}</dd>
          </dl>
          <dl className="flex gap-4">
            <dt className="w-[78px] text-gray-500">서비스 유형</dt>
            <dd>{serviceTypeDisplay}</dd>
          </dl>
          <dl className="flex gap-4">
            <dt className="w-[78px] text-gray-500">이용일</dt>
            <dd>{formattedMoveDate}</dd>
          </dl>
          <dl className="flex gap-4">
            <dt className="w-[78px] text-gray-500">출발지</dt>
            <dd>{requestInfo.departureAddress}</dd>
          </dl>
          <dl className="flex gap-4">
            <dt className="w-[78px] text-gray-500">도착지</dt>
            <dd>{requestInfo.arrivalAddress}</dd>
          </dl>
          <dl className="flex gap-4">
            <dt className="w-[78px] text-gray-500">요청사항</dt>
            <dd>{requestInfo.additionalRequirements}</dd>
          </dl>
          <div
            className={clsx(
              "absolute top-3 right-4 flex rounded-3xl border border-gray-400 bg-white px-4 py-1 text-gray-500 lg:top-6 lg:right-6",
              {
                "bg-primary-light border-primary text-primary font-semibold":
                  statusKey === "PENDING" || statusKey === "CONCLUDED",
              }
            )}
          >
            {statusLabel}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h3 className="text-base font-bold lg:text-2xl">견적서 목록</h3>
        </div>
        <div className="flex flex-col gap-6">
          {quotations.length > 0 ? (
            quotations.map((q) => (
              <OrderCard
                key={q.quotation.quotationId}
                user={q.user}
                request={q.request}
                quotation={q.quotation}
              />
            ))
          ) : (
            <p className="py-6 text-center text-gray-500">아직 받은 견적서가 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
}
