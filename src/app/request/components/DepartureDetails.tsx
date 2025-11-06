import React, { useMemo, useCallback, useRef } from "react";
import { StepProps } from "@/types/request";
import ChatBubble from "@/components/ui/ChatBubble";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { cleanNumericInput } from "@/utils/constant/numericInput";
import AddressInputGroup from "./AddressInputGroup";
import { splitAddress } from "@/utils/constant/addressUtils";

// Zustand 임포트
import { useRequestDraftStore } from "@/store/useRequestDraftStore";
import { useShallow } from "zustand/react/shallow";

const DepartureDetails: React.FC<StepProps> = ({ onNext, isCompleted, onEdit }) => {
  const { departureAddress, departureFloor, departurePyeong, departureElevator, updateField } =
    useRequestDraftStore(
      useShallow((state) => ({
        departureAddress: state.departureAddress,
        departureFloor: state.departureFloor,
        departurePyeong: state.departurePyeong,
        departureElevator: state.departureElevator,
        updateField: state.updateField,
      }))
    );

  const { base: baseAddress, detail: detailAddress } = useMemo(
    () => splitAddress(departureAddress),
    [departureAddress]
  );
  const floorString = String(departureFloor || "");
  const pyeongString = String(departurePyeong || "");
  const isElevator = departureElevator ?? false;

  // 유효성 검사를 위한 숫자 변환
  const floor = Number(floorString);
  const pyeong = Number(pyeongString);

  const detailAddressRef = useRef<HTMLInputElement>(null);

  const handleBaseAddressChange = useCallback(
    (value: string) => {
      const newAddress = `${value} | `;
      updateField("departureAddress", newAddress);
    },
    [updateField]
  );
  const handleDetailAddressChange = useCallback(
    (value: string) => {
      const newAddress = `${baseAddress} | ${value.trim()}`;
      updateField("departureAddress", newAddress);
    },
    [baseAddress, updateField]
  );

  const handleFloorChange = (value: string) => {
    const cleanedValue = cleanNumericInput(value);
    // String -> Number | null 로 변환하여 Zustand에 저장
    const numValue = cleanedValue ? Number(cleanedValue) : null;
    updateField("departureFloor", numValue);
  };

  const handlePyeongChange = (value: string) => {
    const cleanedValue = cleanNumericInput(value);
    const numValue = cleanedValue ? Number(cleanedValue) : null;
    updateField("departurePyeong", numValue);
  };

  const handleElevatorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateField("departureElevator", e.target.checked);
  };

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

  const handleSubmit = () => {
    if (!isFormValid) {
      alert("주소, 층수, 면적을 입력해주세요.");
      return;
    }
    onNext();
  };

  const summaryDetails = useMemo(() => {
    const addr = departureAddress || "-";
    const flr = departureFloor ? `${departureFloor}층` : "-";
    const png = departurePyeong ? `${departurePyeong}평` : "-";
    const elev = departureElevator ? "있음" : "없음";

    return { addr, flr, png, elev };
  }, [departureAddress, departureFloor, departurePyeong, departureElevator]);

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
              onBaseAddressChange={handleBaseAddressChange}
              onDetailAddressChange={handleDetailAddressChange}
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
                onChange={handleElevatorChange}
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
              message={`${summaryDetails.addr.replace(" | ", ", ")} / ${summaryDetails.flr} / ${summaryDetails.png} / 엘레베이터 ${summaryDetails.elev}`}
              theme="primary"
              isMe={true}
            />
            <Button
              className="!text-primary border-0 bg-transparent px-0 !text-base underline hover:bg-transparent"
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
