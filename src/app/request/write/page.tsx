"use client";

import { useState } from "react";
import ProgressBar from "../components/ProgressBar";
import MovingType from "../components/MovingType";
import MovingDate from "../components/MovingDate";
import DepartureDetails from "../components/DepartureDetails";
import ArrivalDetails from "../components/ArrivalDetails";
import { STEP_KEYS, StepKey, StepStatus, RequestFormData } from "@/types/request";
import Requirements from "../components/Requirements";
import { submitRequest } from "@/services/requestService";
import RequestCompleteModal from "../components/RequestCompleteModal";
import { isAxiosError } from "axios";
import { ServerErrorResponse } from "@/types/serverError";
import Script from "next/script";

const initialStepStatus: StepStatus = STEP_KEYS.reduce((acc, key) => {
  acc[key] = false;
  return acc;
}, {} as StepStatus);

export default function RequestPage() {
  const [formData, setFormData] = useState<Partial<RequestFormData>>({});
  const [stepsCompleted, setStepsCompleted] = useState<StepStatus>(initialStepStatus);
  const [isSubmissionSuccess, setIsSubmissionSuccess] = useState(false);

  // 현재 활성화된 스텝을 추적 (ProgressIndicator용)
  const getCurrentActiveStep = (): StepKey => {
    for (const key of STEP_KEYS) {
      if (!stepsCompleted[key]) return key;
    }
    return STEP_KEYS[STEP_KEYS.length - 1]; // 모두 완료되면 마지막 단계
  };

  // 폼 데이터 업데이트 및 스텝 완료 처리
  const handleStepComplete = (stepKey: StepKey, data: Partial<RequestFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));

    const currentIndex = STEP_KEYS.indexOf(stepKey);
    setStepsCompleted((prev) => ({ ...prev, [stepKey]: true }));

    if (currentIndex === STEP_KEYS.length - 1) {
      handleSubmit(data);
    } else {
      const nextStepKey = STEP_KEYS[currentIndex + 1];
      if (nextStepKey) {
        document.getElementById(`step-${nextStepKey}`)?.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  // 최종 제출 처리
  const handleSubmit = async (data: Partial<RequestFormData>) => {
    const finalData = { ...formData, ...data } as RequestFormData; // TODO: 서버 API로 데이터 전송 로직 구현
    try {
      await submitRequest(finalData);
      console.log("최종 제출 데이터:", finalData); // 최종 완료 메시지를 표시

      setStepsCompleted(
        STEP_KEYS.reduce((acc, key) => {
          acc[key] = true;
          return acc;
        }, {} as StepStatus)
      );
      setIsSubmissionSuccess(true);
    } catch (error) {
      let userMessage = "요청 처리 중 알 수 없는 오류가 발생했습니다.";

      if (isAxiosError(error) && error.response) {
        const status = error.response.status;

        if (status >= 400 && error.response.data) {
          const serverData = error.response.data as ServerErrorResponse;

          if (serverData.message) {
            userMessage = serverData.message;
          } else {
            userMessage = `요청 실패 (코드: ${status})`;
          }
          console.error(`API 오류 [${status}]:`, error.response.data);
        }
      } else {
        userMessage = "네트워크 연결 상태를 확인해 주세요.";
      }

      alert(userMessage);
      throw error;
    }
  };

  const handlePrev = (targetStepKey: StepKey) => {
    // 현재 스텝의 완료 상태를 false로 변경하여 다시 활성화 (수정하기)
    setStepsCompleted((prev) => ({ ...prev, [targetStepKey]: false }));

    const targetElement = document.getElementById(`step-${targetStepKey}`);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  // 최종 완료 상태 확인
  const isFinalComplete = stepsCompleted.requirements;

  return (
    <div className="estimate-container flex min-h-[calc(100vh-80px)] flex-col">
      <div className="flex flex-grow flex-col">
        <div className="mx-auto flex w-full flex-col gap-2 px-4 pt-6 pb-4 md:px-5 lg:max-w-[1400px] lg:gap-8 lg:px-8 xl:max-w-[1400px] xl:gap-8 xl:px-0">
          <h1 className="text-xl font-bold text-gray-900 lg:text-3xl">견적요청</h1>
          <ProgressBar currentStep={getCurrentActiveStep()} />
        </div>

        <div className="flex-grow bg-gray-200 py-6 lg:py-12">
          <div className="mx-auto flex flex-col gap-4 px-4 md:px-5 lg:max-w-[1400px] lg:px-8 xl:max-w-[1400px] xl:gap-8 xl:px-0">
            {/* 1. 이사 종류 (MovingType) */}
            <div id="step-type" className="flex flex-col gap-4 transition-opacity duration-500">
              <MovingType
                onNext={(data) => handleStepComplete("type", data)}
                initialData={formData}
                isCompleted={stepsCompleted.type}
                onEdit={!isFinalComplete ? () => handlePrev("type") : undefined}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
