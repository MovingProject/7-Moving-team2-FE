export type TabItem = {
  label: string;
  path: string;
};

// 탭 컴포넌트 Props 타입 정의
export interface TabNavigationProps {
  tabs: readonly TabItem[];
}

export const DRIVER_TABS = {
  sent: {
    label: "보낸 견적 조회",
    path: "sent",
  },
  rejected: {
    label: "반려 요청",
    path: "rejected",
  },
} as const;

export const DRIVER_TAB_LIST = Object.values(DRIVER_TABS);

export const CONSUMER_TABS = {
  pending: {
    label: "대기중인 견적",
    path: "pending",
  },
  received: {
    label: "받았던 견적",
    path: "received",
  },
} as const;

export const CONSUMER_TAB_LIST = Object.values(CONSUMER_TABS);
