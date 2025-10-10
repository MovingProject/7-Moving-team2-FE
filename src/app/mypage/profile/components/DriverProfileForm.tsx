"use client";

import { useEffect, useState } from "react";
import { DriverProfileData } from "@/types/card";
import InputArea from "../../basicEdit/[id]/components/InputArea";
import ImageInputArea from "./ImageInputArea";
import TagForm from "./TagForm";
import Button from "@/components/ui/Button";
import { useDriverProfileForm } from "@/hooks/useDriverProFileForm";

interface DriverFormProps {
  initialData: DriverProfileData | null;
  userId: string;
}

type DriverFormState = Partial<DriverProfileData> & {
  services?: string[];
  regions?: string[];
  oneLiner?: string;
  description?: string;
};

const hasField = (obj: unknown, field: string): obj is Record<string, unknown> => {
  return obj !== null && typeof obj === "object" && field in obj;
};

const getStringField = (obj: unknown, field: string): string => {
  if (hasField(obj, field) && typeof obj[field] === "string") {
    return obj[field] as string;
  }
  return "";
};

const getArrayField = (obj: unknown, field: string): string[] => {
  if (hasField(obj, field) && Array.isArray(obj[field])) {
    return obj[field] as string[];
  }
  return [];
};

export const REGIONS = [
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
export type Region = (typeof REGIONS)[number];

export default function DriverProfileForm({ initialData, userId }: DriverFormProps) {
  const {
    nickname,
    setNickname,
    careerYears,
    setCareerYears,
    oneLiner,
    setOneLiner,
    description,
    setDescription,
    selectedServices,
    setSelectedServices,
    selectedRegions,
    setSelectedRegions,
    nicknameError,
    careerError,
    oneLinerError,
    descriptionError,
    servicesError,
    regionsError,
    validateNickname,
    validateCareer,
    validateOneLiner,
    validateDescription,
    validateServices,
    validateRegions,
    validateAll,
    setInitialData,
    hasErrors,
    isFormComplete,
  } = useDriverProfileForm();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showNickname, setShowNicknma] = useState(false);

  const isEditMode = initialData !== null;

  useEffect(() => {
    if (initialData) {
      setInitialData({
        nickname: initialData.nickname || "",
        careerYears: initialData.careerYears || 0,
        oneLiner: getStringField(initialData, "oneLiner"),
        description: getStringField(initialData, "description"),
        services: getArrayField(initialData, "services"),
        regions: getArrayField(initialData, "regions"),
      });
    }
  }, [initialData, setInitialData]);

  const handleSubmit = () => {
    // 전체 유효성 검사 실행
    if (!validateAll()) {
      console.log("유효성 검사 실패");
      return;
    }

    const formData = {
      nickname,
      careerYears,
      oneLiner,
      description,
      services: selectedServices,
      regions: selectedRegions,
    };

    if (isEditMode) {
      // 수정 API 호출
      console.log("수정 데이터:", formData);
      // TODO: 수정 API 연결
    } else {
      // 등록 API 호출
      console.log("등록 데이터:", formData);
      // TODO: 등록 API 연결
    }
  };

  const handleCancel = () => {
    if (isEditMode && initialData) {
      // 원래 데이터로 되돌리기
      setInitialData({
        nickname: initialData.nickname || "",
        careerYears: initialData.careerYears || 0,
        oneLiner: getStringField(initialData, "oneLiner"),
        description: getStringField(initialData, "description"),
        services: getArrayField(initialData, "services"),
        regions: getArrayField(initialData, "regions"),
      });
    }
    // TODO: 페이지 이동 또는 모달 닫기
  };

  return (
    <>
      <div className="flex items-center justify-center">
        <div className="mt-5 flex w-full max-w-[424px] flex-col items-center justify-center p-6 lg:max-w-[1200px]">
          <div className="flex w-full flex-col lg:flex-row lg:gap-15">
            <div className="flex w-full flex-col gap-4 lg:w-1/2">
              <div className="w-full">
                <div className="mb-6 flex w-full flex-col">
                  <p className="w-full pb-4 text-[18px] leading-[26px] font-bold text-[#1F1F1F]">
                    {isEditMode ? "기사님 프로필 수정" : "기사님 프로필 등록"}
                  </p>
                  <span className="text-gray-500">
                    {isEditMode ? "" : "추가 정보를 입력하여 회원가입을 완료해주세요."}
                  </span>
                </div>

                <ImageInputArea />
                <InputArea
                  label="별명"
                  value={nickname}
                  onChange={(value) => {
                    setNickname(value);
                    validateNickname(value);
                  }}
                  error={nicknameError}
                  placeholder="사이트에 노출될 별명을 입력해 주세요"
                />
                <InputArea
                  label="경력"
                  value={careerYears ? String(careerYears) : ""}
                  onChange={(value) => {
                    setCareerYears(Number(value) || 0);
                    validateCareer(value);
                  }}
                  inputType="number"
                  error={careerError}
                  placeholder="기사님의 경력을 입력해 주세요"
                />
                <InputArea
                  label="한 줄 소개"
                  value={oneLiner}
                  onChange={(value) => {
                    setOneLiner(value);
                    validateOneLiner(value);
                  }}
                  error={oneLinerError}
                  placeholder="한 줄 소개를 입력해 주세요"
                />

                <div className="mt-4 lg:hidden">
                  <TagForm
                    Tags={["소형이사", "가정이사", "사무실이사"]}
                    label="제공 서비스"
                    colType="flex"
                    selectedTags={selectedServices}
                    setSelectedTags={(tags) => {
                      setSelectedServices(tags);
                      validateServices(tags);
                    }}
                  />
                  {servicesError && <p className="mt-1 text-sm text-red-500">{servicesError}</p>}
                  <TagForm
                    selectedTags={selectedRegions}
                    setSelectedTags={(tags) => {
                      setSelectedRegions(tags);
                      validateRegions(tags);
                    }}
                    Tags={REGIONS}
                    label="가능구역"
                    colType="grid"
                  />
                  {regionsError && <p className="mt-1 text-sm text-red-500">{regionsError}</p>}
                </div>
              </div>

              <div className="mt-4 w-full">
                <InputArea
                  label="상세 설명"
                  type="textArea"
                  value={description}
                  onChange={(value) => {
                    setDescription(value);
                    validateDescription(value);
                  }}
                  error={descriptionError}
                  placeholder="상세 내용을 입력해 주세요"
                />
              </div>
            </div>

            <div className="hidden gap-4 lg:flex lg:w-1/2 lg:flex-col">
              <TagForm
                selectedTags={selectedServices}
                setSelectedTags={(tags) => {
                  setSelectedServices(tags);
                  validateServices(tags);
                }}
                Tags={["소형이사", "가정이사", "사무실이사"]}
                label="상세설명"
                colType="flex"
              />
              <TagForm
                selectedTags={selectedRegions}
                setSelectedTags={(tags) => {
                  setSelectedRegions(tags);
                  validateRegions(tags);
                }}
                Tags={REGIONS}
                label="가능구역"
                colType="grid"
              />
            </div>
          </div>

          <div className="mt-4 flex w-full flex-col gap-3 lg:w-full lg:flex-row">
            <Button
              className="w-full lg:order-2"
              text={isEditMode ? "수정하기" : "시작하기"}
              disabled={loading || !isFormComplete}
              onClick={handleSubmit}
            />
            {isEditMode && (
              <Button
                className="w-full lg:order-1"
                variant="secondary"
                text="취소"
                disabled={loading}
                onClick={handleCancel}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
