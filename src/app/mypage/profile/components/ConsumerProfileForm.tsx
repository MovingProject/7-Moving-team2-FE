"use client";

import React, { useState, useEffect } from "react";
import { ConsumerProfileData } from "@/types/card";
import Button from "@/components/ui/Button";
import TagForm from "./TagForm";
import { MoveTypeMap } from "@/types/moveTypes";
import { AreaMap, AreaType } from "@/types/areaTypes";
import ImageInputArea from "./ImageInputArea";

const getServiceTags = () => {
  return Object.keys(MoveTypeMap).map((key) => {
    const serverKey = key as keyof typeof MoveTypeMap;
    return {
      value: serverKey,
      label: MoveTypeMap[serverKey].content,
    };
  });
};
const SERVICE_TAGS = getServiceTags();

// const getRegionTags = () => {
//   return Object.keys(AreaMap).map((key) => ({
//     value: key,
//     label: AreaMap[key],
//   }));
// };
// const REGION_TAGS = getRegionTags();

const regions = [
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

interface ConsumerFormProps {
  initialData: ConsumerProfileData;
}

export default function ConsumerProfileForm({ initialData }: ConsumerFormProps) {
  const safeInitialData: ConsumerProfileData = initialData || {
    consumerId: "",
    image: "",
    serviceType: [],
    areas: "",
  };

  const [formData, setFormData] = useState<ConsumerProfileData>(safeInitialData);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const isNewUser = !formData.consumerId; // consumerId 없으면 등록 모드
    const actionText = isNewUser ? "등록" : "수정";

    try {
      console.log(`소비자 프로필 ${actionText} 요청 데이터:`, formData);
      // TODO: 실제 API 호출 (Firestore updateDoc 또는 addDoc)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setMessage(`프로필이 성공적으로 ${actionText}되었습니다.`);
    } catch (error) {
      setMessage(`프로필 ${actionText} 중 오류가 발생했습니다.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="flex w-full flex-col gap-5 pt-4 pb-10 lg:gap-16 lg:pt-6">
        <div className="flex flex-col gap-4 border-b border-gray-200 pb-4 lg:gap-8 lg:pb-8">
          <h2 className="text-2xl font-bold text-gray-800 lg:text-3xl">
            프로필 {formData.consumerId ? "수정" : "등록"}
          </h2>
          {!formData.consumerId && (
            <p className="text-xs text-gray-600 lg:text-lg">
              "추가 정보를 입력하여 회원가입을 완료해주세요.
            </p>
          )}
        </div>
        <form onSubmit={handleSubmit} className="w-full space-y-8">
          <div className="flex w-full flex-wrap gap-8">
            <div className="flex w-full flex-col gap-6">
              <ImageInputArea />
              {/* 선호 서비스 유형 태그 */}
              <TagForm
                selectedTags={selectedServices}
                setSelectedTags={setSelectedServices}
                Tags={["소형이사", "가정이사", "사무실이사"]}
                label="이용 서비스"
                subText="* 이용 서비스는 중복 선택 가능하며, 언제든 수정 가능해요!"
                colType="flex"
              />

              {/* 관심 지역 태그 */}
              <TagForm
                selectedTags={selectedServices}
                setSelectedTags={setSelectedServices}
                Tags={regions}
                label="내가 사는 지역"
                subText="*내가 사는 지역은 언제든 수정 가능해요!"
                colType="grid"
              />
            </div>
          </div>

          {/* 저장 버튼 */}
          <div className="mt-8 flex w-full flex-col justify-end gap-4 pt-4 lg:flex-row">
            {message && (
              <p
                className={`mr-4 self-center font-medium ${message.includes("오류") ? "text-warning" : "text-green-600"}`}
              >
                {message}
              </p>
            )}
            <Button type="submit" className="w-full px-8 py-2" disabled={loading}>
              {loading
                ? `${formData.consumerId ? "수정" : "등록"} 중...`
                : `${formData.consumerId ? "수정하기" : "시작하기"}`}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
