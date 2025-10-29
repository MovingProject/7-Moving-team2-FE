import { MoveType } from "./moveTypes";

export interface RequestFormData {
  serviceType: MoveType | null;
  moveAt: string;

  departureAddress: string;
  departureFloor: number | null;
  departureElevator: boolean;
  departurePyeong: number | null;

  arrivalAddress: string;
  arrivalFloor: number | null;
  arrivalElevator: boolean;
  arrivalPyeong: number | null;

  additionalRequirements?: string;
}

export interface RequestDraftStore extends RequestFormData {
  updateField: <K extends keyof RequestFormData>(key: K, value: RequestFormData[K]) => void;
  resetDraft: () => void;
}
export interface RequestDetail extends RequestFormData {
  id: string;
  status: "PENDING" | "COMPLETED" | "CANCELLED";
  createdAt: string;
}

export interface RequestCheckResponseDto {
  pendingRequest: RequestDetail | null;
}

export interface StepProps {
  // onPrev: () => void;
  onNext: () => void;
  initialData: RequestDraftStore;
  isCompleted: boolean;
  onEdit: (() => void) | undefined;
}

// 견적요청 단계 순서
export const STEP_KEYS = ["type", "date", "departure", "arrival", "requirements"] as const;

// StepKey 타입
export type StepKey = (typeof STEP_KEYS)[number];

//  StepStatus
export type StepStatus = Record<StepKey, boolean>;
