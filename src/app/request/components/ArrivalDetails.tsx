// components/ArrivalDetails.tsx

import React, { useMemo, useState } from "react";
import { StepProps, RequestFormData } from "@/types/request";
import Button from "@/components/ui/Button";
import ChatBubble from "@/components/ui/ChatBubble";
import Input from "@/components/ui/Input";

const ArrivalDetails: React.FC<StepProps> = ({ onNext, initialData, isCompleted, onEdit }) => {
  const [address, setAddress] = useState(initialData.arrivalAddress || "");
  const [floor, setFloor] = useState<number>(Number(initialData.arrivalFloor || 0));
  const [pyeong, setPyeong] = useState<number>(Number(initialData.arrivalPyeong || 0));
  const [isElevator, setIsElevator] = useState(initialData.arrivalElevator ?? false);

  // 주소, 층수, 면적 : 필수 사항
  const isFormValid = address && floor > 0 && pyeong > 0;

  const handleSubmit = () => {
    if (!isFormValid) {
      alert("주소와 층수를 입력해주세요.");
      return;
    }
    const data: Partial<RequestFormData> = {
      arrivalAddress: address,
      arrivalFloor: floor,
      arrivalPyeong: pyeong,
      arrivalElevator: isElevator,
    };
    onNext(data);
  };

  const summaryDetails = useMemo(() => {
    const addr = initialData.arrivalAddress || "-";
    const flr = initialData.arrivalFloor ? `${initialData.arrivalFloor}층` : "-";
    const png = initialData.arrivalPyeong ? `${initialData.arrivalPyeong}평` : "-";
    const elev = initialData.arrivalElevator ? "있음" : "없음";

    return { addr, flr, png, elev };
  }, [initialData]);

  return (
    <>
      <div className="flex flex-col gap-3">
        <ChatBubble message="도착지 정보를 입력해주세요" theme="white" />
      </div>
      <div className="flex justify-end">
        {!isCompleted ? (
          <div className="flex w-[312px] flex-col gap-2.5 rounded-2xl bg-white p-4 shadow-lg lg:w-[624px] lg:gap-6 lg:p-10">
            <div className="">
              <label className="mb-1 block text-sm font-medium text-gray-700">도착지 주소</label>
              <Input
                value={address}
                onChange={(value) => setAddress(value)}
                className="w-full rounded-lg border p-2"
                placeholder="예: 서울특별시 강남구 테헤란로 123"
              />
            </div>

            {/* 상세주소(층수) */}
            <div className="">
              <label className="mb-1 block text-sm font-medium text-gray-700">층수</label>
              <Input
                value={floor}
                onChange={(value) => setFloor(Number(value))}
                className="w-full rounded-lg border p-2"
                placeholder="예: 5(5층)"
              />
            </div>

            {/* 면적(평수) */}
            <div className="">
              <label className="mb-1 block text-sm font-medium text-gray-700">면적(평수)</label>
              <Input
                value={pyeong}
                onChange={(value) => setPyeong(Number(value))}
                className="w-full rounded-lg border p-2"
                placeholder="예: 8(8평)"
              />
            </div>

            {/* 엘리베이터 유무 */}
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={isElevator}
                onChange={(e) => setIsElevator(e.target.checked)}
                id="dep-elevator"
                className="text-primary border-primary h-4 w-4 rounded"
              />
              <label htmlFor="dep-elevator" className="ml-2 block text-sm text-gray-900">
                엘리베이터 유무
              </label>
            </div>

            <div className="flex justify-between">
              <Button
                onClick={handleSubmit}
                disabled={!isFormValid}
                className={`w-full font-semibold transition-opacity ${isFormValid ? "bg-primary text-white" : "cursor-not-allowed bg-gray-300 text-gray-500"}`}
                text="작성 완료"
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-end">
            <ChatBubble
              message={`${summaryDetails.addr} ,  ${summaryDetails.flr} , ${summaryDetails.png} , 엘레베이터 ${summaryDetails.elev}`}
              theme="primary"
              isMe={true}
            />
            <Button
              className="border-0 bg-transparent px-0 text-xs text-gray-600 underline hover:bg-transparent"
              text="수정하기"
              onClick={onEdit}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default ArrivalDetails;
