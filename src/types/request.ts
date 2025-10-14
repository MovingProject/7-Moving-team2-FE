export interface RequestFormData {
  movingType: string;
  movingDate: string;

  departureAddress: string;
  departureFloor: Number;
  departureElevator: boolean;
  departurePyeong: Number;

  arrivalAddress: string;
  arrivalFloor: Number;
  arrivalElevator: boolean;
  arrivalPyeong: Number;

  additionalRequirements?: String;
}

export interface StepProps {
  // onPrev: () => void;
  onNext: (data: Partial<RequestFormData>) => void;
  initialData: Partial<RequestFormData>;
  isCompleted: boolean;
  onEdit?: () => void;
}

// 견적요청 단계 순서
export const STEP_KEYS = ["type", "date", "departure", "arrival", "requirements"] as const;

// StepKey 타입
export type StepKey = (typeof STEP_KEYS)[number];

//  StepStatus
export type StepStatus = Record<StepKey, boolean>;
