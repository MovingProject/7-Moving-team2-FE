// 지역 필터 옵션
export const REGION_OPTIONS = [
  "전체",
  "서울",
  "경기",
  "인천",
  "강원",
  "충북",
  "충남",
  "세종",
  "대전",
  "전북",
  "전남",
  "광주",
  "경북",
  "경남",
  "대구",
  "울산",
  "부산",
  "제주",
];

// 서비스 필터 옵션
export const SERVICE_OPTIONS = ["전체", "소형이사", "가정이사", "사무실이사"];

// 정렬 필터 옵션 (회원 기사 찾기 페이지)
export const SORT_OPTIONS = ["리뷰 많은 순", "평점 높은 순", "경력 높은 순", "확정 많은 순"];

// 정렬 필터 옵션 (기사 받은 요청 페이지)
export const SORT_TECH_OPTIONS = ["이사 빠른 순", "요청일 빠른 순"];

// 회원 프로필 옵션 (기사는 프로필 드롭다운 필요 없어보임)
export const PROFILE_OPTIONS = ["프로필 수정", "찜한 기사님", "이사 리뷰"];

// 알림 옵션 (현재 정적 옵션, 추후 API 붙일 때 수정 필요)
export const NOTIFICATION_OPTIONS = [
  "김코드 기사님의 소형이사 견적이 도착했어요",
  "김코드 기사님의 견적이 확정되었어요",
  "내일은 경기(일산) -> 서울(영등포) 이사 예정일이에요",
  "김무빙 기사님이 채팅을 요청했어요",
  "이삿짐 기사님이 채팅을 보냈어요",
];

// 체크 필터 - 이사 유형 옵션 (괄호 안 숫자 추후 API 작업 시 동적 처리 필요)
export const MOVE_TYPE_OPTIONS = [
  { label: "소형이사", value: "SMALL_MOVE" },
  { label: "가정이사", value: "HOME_MOVE" },
  { label: "사무실이사", value: "OFFICE_MOVE" },
];

//체크 필터 - 필터 옵션 (괄호 안 숫자 추후 API 작업 시 동적 처리 필요)
export const CHECK_FILTER_OPTIONS = [
  { label: "서비스 가능 지역 (10)", value: "region" },
  { label: "지정 견적 요청 (10)", value: "invited" },
];
