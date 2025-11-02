export const REQUEST_STATUS = {
  PENDING: {
    label: "대기 중",
    description: "요청이 접수되었지만 아직 처리되지 않은 상태입니다.",
  },
  CONCLUDED: {
    label: "진행 중",
    description: "요청이 승인되어 일정이나 거래가 확정된 상태입니다.",
  },
  COMPLETE: {
    label: "완료",
    description: "요청된 작업이나 서비스가 성공적으로 완료된 상태입니다.",
  },
  CANCELLED: {
    label: "취소됨",
    description: "요청이 사용자 또는 관리자에 의해 취소된 상태입니다.",
  },
  EXPIRED: {
    label: "만료됨",
    description: "응답 기한이 지나 자동으로 무효화된 상태입니다.",
  },
  WITHDRAWN: {
    label: "철회됨",
    description: "요청자가 확정 전 스스로 요청을 철회한 상태입니다.",
  },
} as const;

export type RequestStatus = keyof typeof REQUEST_STATUS;

export const QUOTATION_STATEMENT = {
  PENDING: {
    label: "대기 중",
    description: "견적서가 제출되었으며, 대기 상태입니다.",
  },
  CONCLUDED: {
    label: "견적 확정",
    description: "견적 조건에 대해 상호 협의가 완료된 상태입니다.",
  },
  COMPLETED: {
    label: "완료",
    description: "이사가 모두 완료된 상태입니다.",
  },
  REJECTED: {
    label: "반려",
    description: "견적 제안이 상대방에 의해 거절된 상태입니다.",
  },
  EXPIRED: {
    label: "만료",
    description: "유효 기간이 지나 견적이 만료된 상태입니다.",
  },
  CANCELLED: {
    label: "취소",
    description: "견적이 취소한 상태입니다.",
  },
} as const;

export type QuotationStatement = keyof typeof QUOTATION_STATEMENT;
