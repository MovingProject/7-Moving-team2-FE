import { STEP_KEYS, StepKey } from "@/types/request";
import React from "react";

interface ProgressProps {
  currentStep: StepKey;
}

const ProgressBar: React.FC<ProgressProps> = ({ currentStep }) => {
  const totalSteps = STEP_KEYS.length;
  const currentIndex = STEP_KEYS.findIndex((key) => key === currentStep);

  const isAllStepsCompleted = currentIndex === totalSteps - 1;

  const completedSteps = isAllStepsCompleted ? totalSteps : currentIndex;
  const progressPercentage = Math.round((completedSteps / totalSteps) * 100);

  return (
    <>
      <div className="h-1.5 w-full rounded-full bg-gray-200 lg:h-3">
        <div
          className="bg-primary h-1.5 rounded-full transition-all duration-500 ease-in-out lg:h-3"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
    </>
  );
};

export default ProgressBar;
