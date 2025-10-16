import React from "react";
import { useRouter } from "next/navigation";
import { RequestFormData } from "@/types/request";
import Button from "@/components/ui/Button";
import { MoveTypeMap, MoveType } from "@/types/moveTypes";

interface ModalProps {
  formData: Partial<RequestFormData>;
}
const getMoveTypeDisplayName = (typeKey: MoveType | undefined): string => {
  if (!typeKey) return "-";
  const item = Object.values(MoveTypeMap).find((item) => item.clientType === typeKey);
  return item ? item.content : typeKey;
};

const RequestCompleteModal: React.FC<ModalProps> = ({ formData }) => {
  const displayMoveType = getMoveTypeDisplayName(formData.serviceType);
  const router = useRouter();

  const handleGoToMain = () => {
    router.push("/");
  };

  const handleGoToDrivers = () => {
    router.push("/driverList");
  };

  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-[360px] rounded-lg bg-white p-6 shadow-2xl lg:w-[500px] lg:rounded-2xl lg:p-10">
        <h2 className="text-primary mb-4 text-center text-2xl font-bold">견적 요청 완료!</h2>
        <p className="mb-6 text-center text-gray-700">
          입력하신 정보가 성공적으로 전달되었습니다.
          <br />
          기사님들께서 곧 요청을 확인하여,
          <br />
          견적을 보내주실 예정입니다.
        </p>

        <div className="mb-6 rounded-lg border border-gray-300 bg-gray-50 p-4">
          <h3 className="mb-2 text-lg font-semibold">요청 내역</h3>
          <div>
            <p className="text-sm lg:text-base">
              <span className="font-medium">이사 종류:</span> {displayMoveType}
            </p>
            <p className="text-sm lg:text-base">
              <span className="font-medium">이사 일자:</span> {formData.moveAt}
            </p>
            <p className="truncate text-sm lg:text-base">
              <span className="font-medium">출발지:</span> {formData.departureAddress}
            </p>
            <p className="truncate text-sm lg:text-base">
              <span className="font-medium">도착지:</span> {formData.arrivalAddress}
            </p>
            <p className="truncate text-sm lg:text-base">
              <span className="font-medium">추가 요청사항:</span> {formData.additionalRequirements}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Button variant="primary" onClick={handleGoToDrivers} text="기사님 찾기" />
          <Button onClick={handleGoToMain} text="메인으로 돌아가기" variant="secondary" />
        </div>
      </div>
    </div>
  );
};

export default RequestCompleteModal;
