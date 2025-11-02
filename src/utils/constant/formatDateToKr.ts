export const formatDateToKr = (dateString: string | null | undefined): string => {
  if (!dateString) {
    return "날짜 미정";
  }

  const datePart = dateString.substring(0, 10);
  const date = new Date(datePart);

  if (isNaN(date.getTime())) {
    return "날짜 오류";
  }

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${year}년 ${month}월 ${day}일`;
};
