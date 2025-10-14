import React, { useMemo, useState } from "react";
import { RequestFormData, StepProps } from "@/types/request";
import ChatBubble from "@/components/ui/ChatBubble";
import Button from "@/components/ui/Button";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const formatDateToString = (date: Date | null): string => {
  if (!date) return "";
  return date.toISOString().split("T")[0]; // 'YYYY-MM-DD' 형식
};

// string 날짜를 Date 객체로 변환하는 헬퍼 함수
const parseStringToDate = (dateString: string): Date | null => {
  if (!dateString) return null;
  return new Date(dateString);
};

const MovingDate: React.FC<StepProps> = ({ onNext, initialData, isCompleted, onEdit }) => {
  const [selectedDate, setSelectedDate] = useState<string>(initialData.movingDate || "");

  // 날짜 상태를 Date 객체 형태로 변환 (날짜 선택 라이브러리 사용을 위해)
  const selectedDateObject = useMemo(() => parseStringToDate(selectedDate), [selectedDate]);

  // 라이브러리에서 Date 객체를 받았을 때 호출되는 핸들러
  const handleDateChange = (date: Date | null) => {
    const dateString = formatDateToString(date);
    setSelectedDate(dateString);
  };

  // 폼 유효성 검사 (날짜 문자열이 비어있지 않은지 확인)
  const isFormValid = !!selectedDate;

  const handleSubmit = () => {
    if (!isFormValid) {
      alert("이사 날짜를 선택해주세요.");
      return;
    }

    const data: Partial<RequestFormData> = {
      movingDate: selectedDate,
    };
    onNext(data);
  };
  const summaryValue = useMemo(() => {
    if (!initialData.movingDate) return "날짜 미정";

    try {
      // initialData.movingDate가 YYYY-MM-DD 형식이라고 가정하고 파싱합니다.
      return new Date(initialData.movingDate).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (e) {
      return initialData.movingDate; // 파싱 실패 시 원본 값 반환
    }
  }, [initialData.movingDate]);

  return (
    <>
      <div className="flex flex-col gap-3">
        <ChatBubble message="이사 예정일을 선택해주세요." theme="white" />
      </div>
      <div className="flex justify-end">
        {!isCompleted ? (
          <div className="flex w-[312px] flex-col gap-2.5 rounded-2xl bg-white p-4 shadow-lg lg:w-[624px] lg:gap-6 lg:p-10">
            <DatePicker
              selected={selectedDateObject}
              onChange={handleDateChange}
              dateFormat="yyyy년 MM월 dd일"
              inline
              customInput={<div style={{ display: "none" }} />}
            />
            {/* <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="focus:border-primary w-full rounded-lg border p-2"
            /> */}
            <Button
              onClick={handleSubmit}
              disabled={!selectedDate}
              className={`w-full font-semibold transition-opacity ${selectedDate ? "bg-primary text-white" : "cursor-not-allowed bg-gray-300 text-gray-500"}`}
              text="선택 완료"
            />
          </div>
        ) : (
          <div className="flex flex-col items-end">
            <ChatBubble message={summaryValue} theme="primary" isMe={true} />
            <Button
              className="border-0 bg-transparent px-0 text-xs text-gray-600 underline hover:bg-transparent"
              text="수정하기"
              onClick={onEdit}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default MovingDate;
