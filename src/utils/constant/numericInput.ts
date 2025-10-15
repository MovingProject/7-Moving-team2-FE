export const cleanNumericInput = (value: string): string => {
  // 숫자, 소수점(.) 허용하는 정규식
  let cleanedValue = value.replace(/[^\d.]/g, "");

  // 소수점이 두 개 이상 입력 방지
  const parts = cleanedValue.split(".");
  if (parts.length > 2) {
    cleanedValue = parts[0] + "." + parts.slice(1).join("");
  }

  if (cleanedValue.length > 1 && cleanedValue.startsWith("0") && !cleanedValue.startsWith("0.")) {
    cleanedValue = cleanedValue.slice(1);
  }

  return cleanedValue;
};
