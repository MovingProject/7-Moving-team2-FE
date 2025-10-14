export interface RequestFormData {
  movingType: string;
  movingDate: string;

  departureAddress: string;
  departureFloor: number;
  departureElevator: boolean;
  departurePyeong: number;

  arrivalAddress: string;
  arrivalFloor: number;
  arrivalElevator: boolean;
  arrivalPyeong: number;

  additionalRequirements?: string;
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
