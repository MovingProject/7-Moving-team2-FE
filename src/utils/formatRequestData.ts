import { AreaMap } from "@/types/areaTypes";

/**
 * 날짜 포맷: YYYY-MM-DD
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toISOString().split("T")[0]; // ex) 2025-10-16
};

/**
 * 주소 포맷: 앞 두 단어만 추출
 * 예: "경기도 성남시 분당구 판교로" → "경기도 성남시"
 */
export const formatAddressShort = (address: string): string => {
  if (!address) return "";
  const words = address.split(" ");
  return words.slice(0, 2).join(" ");
};

/**
 * 지역명을 AreaMap 기반으로 단축
 * 예: "서울특별시" → "서울", "경기도" → "경기"
 */
export const simplifyAreaName = (address: string): string => {
  if (!address) return "";
  const areaMatch = Object.entries(AreaMap).find(([key, value]) => address.includes(value));
  return areaMatch ? areaMatch[1] : formatAddressShort(address);
};
