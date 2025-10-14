import React, { useState } from "react";
import { StepProps, RequestFormData } from "@/types/request";
import ChatBubble from "@/components/ui/ChatBubble";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

const Requirements: React.FC<StepProps> = ({ onNext, initialData }) => {
  const [requirements, setRequirements] = useState(initialData.additionalRequirements || "");

  // 최종 제출 (견적 요청하기)
  const handleFinalSubmit = () => {
    const data: Partial<RequestFormData> = {
      additionalRequirements: requirements.trim() || undefined,
    };

    onNext(data);
  };

  return (
    <>
      <div className="flex flex-col gap-3">
        <ChatBubble message="추가적인 요청 사항이 있다면, 입력해주세요." theme="white" />
        <ChatBubble message="작성하지 않고, 바로 견적 요청할 수 있습니다." theme="white" />
      </div>
      <div className="flex justify-end">
        <div className="flex w-[312px] flex-col gap-2.5 rounded-2xl bg-white p-4 shadow-lg lg:w-[624px] lg:gap-6 lg:p-10">
          <div className="">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              기타 특이사항 (사다리차 필요, 주차 등)
            </label>
            <Input
              inputType="textArea"
              value={requirements.toString()}
              onChange={setRequirements}
              className="w-full rounded-lg border p-2"
              placeholder="계단 작업, 주차 공간 협소 등 기사님께 전달할 정보"
            />
          </div>

          <Button
            onClick={handleFinalSubmit}
            className="bg-primary font-semibold text-white"
            text="견적 요청하기"
          />
        </div>
      </div>
    </>
  );
};

export default Requirements;
