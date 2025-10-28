import React, { useMemo, useState, useRef } from "react";
import { StepProps, RequestFormData } from "@/types/request";
import ChatBubble from "@/components/ui/ChatBubble";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { cleanNumericInput } from "@/utils/constant/numericInput";
import clsx from "clsx";
import AddressInputGroup from "./AddressInputGroup";

const DepartureDetails: React.FC<StepProps> = ({ onNext, initialData, isCompleted, onEdit }) => {
  const [baseAddress, setBaseAddress] = useState(
    initialData.departureAddress?.split(" | ")[0] || ""
  );
  const [detailAddress, setDetailAddress] = useState(
    initialData.departureAddress?.split(" | ")[1] || ""
  );
  const [floorString, setFloorString] = useState(String(initialData.departureFloor || ""));
  const [pyeongString, setPyeongString] = useState(String(initialData.departurePyeong || ""));
  const [isElevator, setIsElevator] = useState(initialData.departureElevator ?? false);

  const detailAddressRef = useRef<HTMLInputElement>(null);
  const floor = Number(floorString);
  const pyeong = Number(pyeongString);

  // 주소, 층수, 면적 : 필수 사항
  const isFormValid = useMemo(() => {
    return (
      baseAddress.trim() !== "" &&
      detailAddress.trim() !== "" &&
      !isNaN(floor) &&
      floor > 0 &&
      !isNaN(pyeong) &&
      pyeong > 0
    );
  }, [baseAddress, detailAddress, floor, pyeong]);

  const handleFloorChange = (value: string) => {
    const cleanedValue = cleanNumericInput(value);
    setFloorString(cleanedValue);
  };

  const handlePyeongChange = (value: string) => {
    const cleanedValue = cleanNumericInput(value);
    setPyeongString(cleanedValue);
  };

  const handleSubmit = () => {
    if (!isFormValid) {
      alert("주소, 층수, 면적을 입력해주세요.");
      return;
    }
    const fullAddress = `${baseAddress} | ${detailAddress.trim()}`;

    const data: Partial<RequestFormData> = {
      departureAddress: fullAddress,
      departureFloor: floor,
      departurePyeong: pyeong,
      departureElevator: isElevator,
    };
    onNext(data);
  };

  const summaryDetails = useMemo(() => {
    const addr = initialData.departureAddress || "-";
    const flr = initialData.departureFloor ? `${initialData.departureFloor}층` : "-";
    const png = initialData.departurePyeong ? `${initialData.departurePyeong}평` : "-";
    const elev = initialData.departureElevator ? "있음" : "없음";

    return { addr, flr, png, elev };
  }, [initialData]);

  return (
    <>
      <div className="flex flex-col gap-3">
        <ChatBubble message="출발지 정보를 입력해주세요" theme="white" />
      </div>
      <div className="flex justify-end">
        {!isCompleted ? (
          <div className="flex w-[312px] flex-col gap-2.5 rounded-2xl bg-white p-4 shadow-lg lg:w-[624px] lg:gap-6 lg:p-10">
            <AddressInputGroup
              baseAddress={baseAddress}
              detailAddress={detailAddress}
              onBaseAddressChange={setBaseAddress}
              onDetailAddressChange={setDetailAddress}
              detailAddressRef={detailAddressRef}
            />

            {/* 상세주소(층수) */}
            <div className="">
              <label className="mb-1 block text-sm font-medium text-gray-700">층수</label>
              <Input
                value={floorString}
                onChange={handleFloorChange}
                className="w-full rounded-lg border p-2"
                placeholder="예: 5(5층)"
              />
            </div>

            {/* 면적(평수) */}
            <div className="">
              <label className="mb-1 block text-sm font-medium text-gray-700">면적(평수)</label>
              <Input
                value={pyeongString}
                onChange={handlePyeongChange}
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
              message={`${summaryDetails.addr.replace(" | ", ", ")} /  ${summaryDetails.flr} / ${summaryDetails.png} / 엘레베이터 ${summaryDetails.elev}`}
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

export default DepartureDetails;
