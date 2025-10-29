import React, { useMemo, useEffect } from "react";
import { StepProps } from "@/types/request";
import ChatBubble from "@/components/ui/ChatBubble";
import Button from "@/components/ui/Button";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Zustand 임포트
import { useRequestDraftStore } from "@/store/useRequestDraftStore";
import { useShallow } from "zustand/react/shallow";

const formatDateToString = (date: Date | null): string => {
  if (!date) return "";
  return (
    date.getFullYear() +
    "-" +
    String(date.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(date.getDate()).padStart(2, "0")
  );
};

// string 날짜를 Date 객체로 변환하는 헬퍼 함수
const parseStringToDate = (dateString: string): Date | null => {
  if (!dateString) return null;
  // DatePicker가 정확히 'YYYY-MM-DD'를 인식하도록 처리
  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  // 유효성 검사
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null;
  }
  return date;
};

const MovingDate: React.FC<StepProps> = ({ onNext, isCompleted, onEdit }) => {
  const { moveAt, updateField } = useRequestDraftStore(
    useShallow((state) => ({
      moveAt: state.moveAt,
      updateField: state.updateField,
    }))
  );

  const selectedDate = moveAt;

  const minSelectableDate = useMemo(() => {
    const today = new Date();
    const tomorrow = new Date(today);

    tomorrow.setDate(today.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow;
  }, []);

  // 날짜 상태를 Date 객체 형태로 변환 (날짜 선택 라이브러리 사용을 위해)
  const selectedDateObject = useMemo(() => parseStringToDate(selectedDate), [selectedDate]);

  // 이사일자 초기화/유효성 검사 로직
  useEffect(() => {
    const storedDate = parseStringToDate(moveAt);

    // 이사일자가 저장되어 있고, 그 날짜가 내일(minSelectableDate)보다 이전이라면
    if (storedDate && storedDate < minSelectableDate) {
      console.log("이사일자가 유효하지 않아, 선택된 날짜 초기화.");
      updateField("moveAt", ""); // moveAt을 빈 문자열로 초기화
    }
  }, [moveAt, minSelectableDate, updateField]);

  // 라이브러리에서 Date 객체를 받았을 때 호출되는 핸들러
  const handleDateChange = (date: Date | null) => {
    let dateString = "";
    if (date) {
      dateString = formatDateToString(date);
    }

    updateField("moveAt", dateString);
  };

  // 폼 유효성 검사 (날짜 문자열이 비어있지 않은지 확인)
  const isFormValid = !!selectedDate;

  const handleSubmit = () => {
    if (!isFormValid) {
      alert("이사 날짜를 선택해주세요.");
      return;
    }

    onNext();
  };

  const summaryValue = useMemo(() => {
    if (!selectedDate) return "-";

    try {
      return new Date(selectedDate).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (e) {
      return selectedDate;
    }
  }, [selectedDate]);

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
              minDate={minSelectableDate}
              customInput={<div style={{ display: "none" }} />}
            />

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
