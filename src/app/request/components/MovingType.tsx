import React, { useMemo } from "react";
import { RequestDraftStore, StepProps } from "@/types/request";
import ChatBubble from "@/components/ui/ChatBubble";
import Button from "@/components/ui/Button";
import { MoveTypeMap, ClientMoveItem, MoveType } from "@/types/moveTypes";

// Zustand 임포트
import { useRequestDraftStore } from "@/store/useRequestDraftStore";
import { useShallow } from "zustand/react/shallow";

// MoveTypeMap
const moveTypesArray: ClientMoveItem[] = Object.keys(MoveTypeMap).map((key) => {
  const serverKey = key as keyof typeof MoveTypeMap;
  return {
    type: MoveTypeMap[serverKey].clientType,
    content: MoveTypeMap[serverKey].content,
  };
});

// initialData
const MovingType: React.FC<StepProps> = ({ onNext, isCompleted, onEdit }) => {
  const { serviceType, updateField } = useRequestDraftStore(
    useShallow((state) => ({
      serviceType: state.serviceType,
      updateField: state.updateField,
    }))
  );

  const selectedType = serviceType;

  const summaryValue = useMemo(() => {
    const selectedItem = moveTypesArray.find((item) => item.type === selectedType);
    return selectedItem ? selectedItem.content : "선택되지 않음";
  }, [selectedType]);

  // 이사 타입 변경 핸들러
  const handleSelectType = (type: MoveType) => {
    updateField("serviceType", type);
  };

  const handleSubmit = () => {
    if (selectedType) {
      onNext();
    } else {
      alert("이사 종류를 선택해주세요.");
    }
  };

  return (
    <>
      <div className="flex flex-col gap-3">
        <ChatBubble
          message="몇 가지 정보만 알려주시면 최대 5개의 견적을 받을 수 있어요 :)"
          theme="white"
        />
        <ChatBubble message="이사 종류를 선택해 주세요." theme="white" />
      </div>
      <div className="flex justify-end">
        {!isCompleted ? (
          <div className="flex w-[312px] flex-col gap-2.5 rounded-2xl bg-white p-4 shadow-lg lg:w-[624px] lg:gap-6 lg:p-10">
            <div className="flex flex-col gap-2">
              {moveTypesArray.map((item) => (
                <button
                  key={item.type}
                  className={`text-md rounded-lg border p-2 font-medium transition-colors lg:p-4 lg:text-lg ${selectedType === item.type ? "border-primary text-primary font-bold shadow-md" : "border-gray-300 bg-white text-gray-500 hover:bg-gray-100"}`}
                  onClick={() => handleSelectType(item.type as MoveType)}
                >
                  {item.content}
                </button>
              ))}
            </div>
            <Button
              onClick={handleSubmit}
              disabled={!selectedType}
              className={`w-full font-semibold transition-opacity ${selectedType ? "bg-primary text-white hover:bg-blue-700" : "cursor-not-allowed bg-gray-300 text-gray-500"}`}
              text="선택 완료"
            />
          </div>
        ) : (
          <div className="flex flex-col items-end">
            <ChatBubble message={summaryValue} theme="primary" isMe={true} />
            <Button
              className="border-0 bg-transparent px-0 text-xs underline hover:bg-transparent"
              text="수정하기"
              onClick={onEdit}
              textColor="text-gray-600"
            />
          </div>
        )}
      </div>
    </>
  );
};

export default MovingType;
