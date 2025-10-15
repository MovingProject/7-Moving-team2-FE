import React, { useMemo, useState } from "react";
import { StepProps } from "@/types/request";
import ChatBubble from "@/components/ui/ChatBubble";
import Button from "@/components/ui/Button";
import { MoveTypeMap, ClientMoveItem } from "@/types/moveTypes";

const MovingType: React.FC<StepProps> = ({ onNext, initialData, isCompleted, onEdit }) => {
  const [selectedType, setSelectedType] = useState(initialData.serviceType);

  // MoveTypeMap을 배열 형태로 변환하여 렌더링에 사용
  const moveTypesArray: ClientMoveItem[] = useMemo(() => {
    return Object.keys(MoveTypeMap).map((key) => {
      const serverKey = key as keyof typeof MoveTypeMap;
      return {
        type: MoveTypeMap[serverKey].clientType,
        content: MoveTypeMap[serverKey].content,
      };
    });
  }, []);
  const summaryValue = useMemo(() => {
    const selectedItem = moveTypesArray.find((item) => item.type === initialData.serviceType);
    return selectedItem ? selectedItem.content : "선택되지 않음";
  }, [initialData.serviceType, moveTypesArray]);

  // 선택된 이사 종류의 표시 이름 (content) 찾기
  const selectedTypeDisplayName = useMemo(() => {
    return moveTypesArray.find((item) => item.type === selectedType)?.content;
  }, [selectedType, moveTypesArray]);

  const handleSubmit = () => {
    if (selectedType) {
      onNext({ serviceType: selectedType });
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
                  onClick={() => setSelectedType(item.type)}
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
