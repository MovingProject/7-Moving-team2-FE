export interface Contract {
  id: string;
  quotationId: string;
  contractNumber: string; // 계약번호 (예: MOVE-2025-001)

  // 고객 정보
  customerName: string;
  customerPhone: string;
  customerAddress: string;

  // 기사 정보
  driverName: string;
  driverPhone: string;
  driverNickname: string;

  // 이사 정보
  serviceType: string; // SMALL_MOVE, HOME_MOVE, OFFICE_MOVE
  moveAt: string;
  departureAddress: string;
  departureFloor?: number;
  departureElevator?: boolean;
  arrivalAddress: string;
  arrivalFloor?: number;
  arrivalElevator?: boolean;

  // 금액 정보
  estimatedPrice: number;
  additionalRequirements?: string;

  // 계약 조건
  depositAmount?: number; // 계약금
  depositPaidAt?: string;
  cancellationPolicy?: string;

  // 날짜
  contractedAt: string; // 계약일
  createdAt: string;

  // 상태
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
}

export const SERVICE_TYPE_KR: { [key: string]: string } = {
  SMALL_MOVE: "소형이사",
  HOME_MOVE: "가정이사",
  OFFICE_MOVE: "사무실 이사",
};
