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
import RequestCompletePage from "../components/RequestCompletePage";
import { isAxiosError } from "axios";
import { ServerErrorResponse } from "@/types/serverError";
import Script from "next/script";

// Zustand 관련 임포트
import { useRequestDraftStore } from "@/store/useRequestDraftStore";
import { DraftProvider, useDraftHydration } from "../components/DraftProvider";
import LogoSpinner from "@/components/ui/LogoSpinner";
import { useActiveRequestQuery } from "@/utils/hook/request/useActiveRequestQuery";

const initialStepStatus: StepStatus = STEP_KEYS.reduce((acc, key) => {
  acc[key] = false;
  return acc;
}, {} as StepStatus);

const loadDaumPostcodeScript = () => {
  if (typeof window !== "undefined" && !document.getElementById("daum-postcode-script")) {
    const script = document.createElement("script");
    script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.id = "daum-postcode-script";
    script.async = true;
    document.head.appendChild(script);
  }
};

export default function RequestPage() {
  loadDaumPostcodeScript();
  return (
    <DraftProvider>
      <RequestPageContent />
    </DraftProvider>
  );
}

function RequestPageContent() {
  const isHydrated = useDraftHydration();
  const draftStore = useRequestDraftStore();
  const formData = draftStore as RequestFormData;

  // 상태 업데이트 및 초기화 액션
  const updateDraft = draftStore.updateField;
  const resetDraft = draftStore.resetDraft;

  const [stepsCompleted, setStepsCompleted] = useState<StepStatus>(initialStepStatus);
  const [isSubmissionSuccess, setIsSubmissionSuccess] = useState(false);
  const { data, isLoading, isError } = useActiveRequestQuery();
  const pendingRequest = data?.pendingRequest;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-500">
        요청 상태를 확인하는 중입니다...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center py-20 text-red-500">
        요청 상태를 불러오는 중 오류가 발생했습니다.
      </div>
    );
  }

  // 진행 중 요청 존재 시 완료 페이지 표시
  if (pendingRequest) {
    return <RequestCompletePage data={pendingRequest} />;
  }

  if (!isHydrated) {
    return <LogoSpinner />;
  }
  // 현재 활성화된 스텝을 추적
  const getCurrentActiveStep = (): StepKey => {
    for (const key of STEP_KEYS) {
      if (!stepsCompleted[key]) return key;
    }
    return STEP_KEYS[STEP_KEYS.length - 1];
  };

  // 폼 데이터 업데이트 및 스텝 완료 처리
  const handleStepComplete = (stepKey: StepKey) => {
    const currentIndex = STEP_KEYS.indexOf(stepKey);
    setStepsCompleted((prev) => ({ ...prev, [stepKey]: true }));

    if (currentIndex === STEP_KEYS.length - 1) {
      // 최종 제출 시, Zustand가 관리하는 전체 상태(formData)를 전달
      handleSubmit(formData);
    } else {
      const nextStepKey = STEP_KEYS[currentIndex + 1];
      if (nextStepKey) {
        document.getElementById(`step-${nextStepKey}`)?.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  // 최종 제출 처리
  const handleSubmit = async (finalData: RequestFormData) => {
    try {
      await submitRequest(finalData);
      console.log("최종 제출 데이터:", finalData);
      resetDraft();

      setStepsCompleted(
        STEP_KEYS.reduce((acc, key) => {
          acc[key] = true;
          return acc;
        }, {} as StepStatus)
      );
      setIsSubmissionSuccess(true);
    } catch (error) {
      // ... 에러 처리 로직 유지 ...
      let userMessage = "요청 처리 중 알 수 없는 오류가 발생했습니다.";

      if (isAxiosError(error) && error.response) {
        const status = error.response.status;

        if (status >= 400 && error.response.data) {
          const serverData = error.response.data as ServerErrorResponse;
          userMessage = serverData.message || `요청 실패 (코드: ${status})`;
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
    // 현재 스텝의 완료 상태를 false로 변경하여 다시 활성화 = 수정하기
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
        <div className="mx-auto flex w-full flex-col gap-2 px-4 pt-6 pb-4 lg:max-w-[1400px] lg:gap-8 lg:px-0">
          <h1 className="text-lg font-bold lg:text-3xl">견적요청</h1>
          <ProgressBar currentStep={getCurrentActiveStep()} />
        </div>

        <div className="flex-grow bg-gray-200 py-6 lg:py-12">
          <div className="mx-auto flex flex-col gap-4 px-4 lg:max-w-[1400px] lg:px-0">
            {/* 1. 이사 종류 (MovingType) - initialData로 draftStore 전달 */}
            <div id="step-type" className="flex flex-col gap-4 transition-opacity duration-500">
              <MovingType
                onNext={() => handleStepComplete("type")}
                initialData={draftStore}
                isCompleted={stepsCompleted.type}
                onEdit={!isFinalComplete ? () => handlePrev("type") : undefined}
              />
            </div>

            {/* 2. 이사 일자 (MovingDate) */}
            {stepsCompleted.type && (
              <div id="step-date" className="flex flex-col gap-4 transition-opacity duration-500">
                <MovingDate
                  onNext={() => handleStepComplete("date")}
                  initialData={draftStore}
                  isCompleted={stepsCompleted.date}
                  onEdit={!isFinalComplete ? () => handlePrev("date") : undefined}
                />
              </div>
            )}

            {/* 3. 출발지 정보 (DepartureDetails) */}
            {stepsCompleted.date && (
              <div
                id="step-departure"
                className="flex flex-col gap-4 transition-opacity duration-500"
              >
                <DepartureDetails
                  onNext={() => handleStepComplete("departure")}
                  initialData={draftStore}
                  isCompleted={stepsCompleted.departure}
                  onEdit={!isFinalComplete ? () => handlePrev("departure") : undefined}
                />
              </div>
            )}

            {/* 4. 도착지 정보 (ArrivalDetails) */}
            {stepsCompleted.departure && (
              <div
                id="step-arrival"
                className="flex flex-col gap-4 transition-opacity duration-500"
              >
                <ArrivalDetails
                  onNext={() => handleStepComplete("arrival")}
                  initialData={draftStore}
                  isCompleted={stepsCompleted.arrival}
                  onEdit={!isFinalComplete ? () => handlePrev("arrival") : undefined}
                />
              </div>
            )}

            {/* 5. 요구사항 정보 (Requirements) */}
            {stepsCompleted.arrival && (
              <div
                id="step-requirements"
                className="flex flex-col gap-4 transition-opacity duration-500"
              >
                <Requirements
                  onNext={() => handleStepComplete("requirements")}
                  initialData={draftStore}
                  isCompleted={stepsCompleted.requirements}
                  onEdit={undefined}
                />
              </div>
            )}

            {/* 완료 모달에도 Zustand 데이터 전달 */}
            {isSubmissionSuccess && <RequestCompleteModal formData={formData} />}
          </div>
        </div>
      </div>
    </div>
  );
}
