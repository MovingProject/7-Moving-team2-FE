"use client";

import { useState } from "react";
import ProgressBar from "../components/ProgressBar";
import MovingType from "../components/MovingType";
import MovingDate from "../components/MovingDate";
import DepartureDetails from "../components/DepartureDetails";
import ArrivalDetails from "../components/ArrivalDetails";
import { STEP_KEYS, StepKey, StepStatus, RequestFormData } from "@/types/request";
import Requirements from "../components/Requirements";

const initialStepStatus: StepStatus = STEP_KEYS.reduce((acc, key) => {
  acc[key] = false;
  return acc;
}, {} as StepStatus);

export default function RequestPage() {
  const [formData, setFormData] = useState<Partial<RequestFormData>>({});
  const [stepsCompleted, setStepsCompleted] = useState<StepStatus>(initialStepStatus);

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
  const handleSubmit = (data: Partial<RequestFormData>) => {
    const finalData = { ...formData, ...data } as RequestFormData; // TODO: 서버 API로 데이터 전송 로직 구현

    console.log("최종 제출 데이터:", finalData); // 최종 완료 메시지를 표시

    setStepsCompleted(
      STEP_KEYS.reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {} as StepStatus)
    );
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
    <div className="estimate-container">
      <div className="">
        <div className="mx-auto flex flex-col gap-2 px-4 pt-6 pb-4 lg:max-w-[1400px] lg:gap-8 lg:px-0">
          <h1 className="text-lg font-bold lg:text-3xl">견적요청</h1>
          <ProgressBar currentStep={getCurrentActiveStep()} />
        </div>

        <div className="bg-gray-200 py-6 lg:py-12">
          <div className="mx-auto flex flex-col gap-4 px-4 lg:max-w-[1400px] lg:px-0">
            {/* 1. 이사 종류 (MovingType) */}
            <div id="step-type" className="flex flex-col gap-4 transition-opacity duration-500">
              <MovingType
                onNext={(data) => handleStepComplete("type", data)}
                initialData={formData}
                isCompleted={stepsCompleted.type}
                onEdit={!isFinalComplete ? () => handlePrev("type") : undefined}
              />
            </div>

            {/* 2. 이사 일자 (MovingDate) */}
            {stepsCompleted.type && (
              <div id="step-date" className="flex flex-col gap-4 transition-opacity duration-500">
                <MovingDate
                  onNext={(data) => handleStepComplete("date", data)}
                  initialData={formData}
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
                  onNext={(data) => handleStepComplete("departure", data)}
                  initialData={formData}
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
                  onNext={(data) => handleStepComplete("arrival", data)}
                  initialData={formData}
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
                  onNext={(data) => handleStepComplete("requirements", data)}
                  initialData={formData}
                  isCompleted={stepsCompleted.requirements}
                  onEdit={undefined}
                />
              </div>
            )}

            {/* 최종 완료 메시지 : 넣을지 말지 고민 */}
            {isFinalComplete && (
              <div className="bg-primary-light border-primary rounded-2xl border p-12 text-center">
                <h2 className="text-primary mb-4 text-2xl font-bold">견적 요청 완료!</h2>
                <p className="text-lg text-gray-600">
                  입력하신 정보로 견적 요청이 전달되었습니다.
                  <br />
                  기사님께서 확인 후 답변드릴 예정입니다.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
