"use client";

import { useEffect, useState } from "react";
import { DriverProfileData } from "@/types/card";
import InputArea from "../../basicEdit/[id]/components/InputArea";
import ImageInputArea from "./ImageInputArea";
import TagForm from "./TagForm";
import Button from "@/components/ui/Button";

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

const hasField = (obj: any, field: string): boolean => {
  return obj && typeof obj === "object" && field in obj;
};

const getStringField = (obj: any, field: string): string => {
  return hasField(obj, field) && typeof obj[field] === "string" ? obj[field] : "";
};

const getArrayField = (obj: any, field: string): string[] => {
  return hasField(obj, field) && Array.isArray(obj[field]) ? obj[field] : [];
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
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [formData, setFormData] = useState<DriverFormState>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showNickname, setShowNicknma] = useState(false);

  const isEditMode = initialData !== null;

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        oneLiner: getStringField(initialData, "oneLiner"),
        description: getStringField(initialData, "description"),
        services: [],
        regions: [],
      });

      const services = getArrayField(initialData, "services");
      const regions = getArrayField(initialData, "regions");

      if (services.length > 0) {
        setSelectedServices(services);
      }
      if (regions.length > 0) {
        setSelectedRegions(regions);
      }
    } else {
      // 등록 모드: 빈 폼
      setFormData({
        nickname: "",
        careerYears: 0,
        oneLiner: "",
        description: "",
        services: [],
        regions: [],
      });
    }
  }, [initialData]);

  const updateField = (key: keyof DriverFormState, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
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
      setFormData({
        ...initialData,
        oneLiner: getStringField(initialData, "oneLiner"),
        description: getStringField(initialData, "description"),
        services: [],
        regions: [],
      });

      const services = getArrayField(initialData, "services");
      const regions = getArrayField(initialData, "regions");

      setSelectedServices(services);
      setSelectedRegions(regions);
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
                  <p className="w-full border-b border-[#F2F2F2] pb-4 text-[18px] leading-[26px] font-bold text-[#1F1F1F]">
                    {isEditMode ? "기사님 프로필 수정" : "기사님 프로필 등록"}
                  </p>
                  <span>{isEditMode ? "" : "추가 정보를 입력하여 회원가입을 완료해주세요."}</span>
                </div>

                <ImageInputArea />
                <InputArea
                  label="별명"
                  value={formData.nickname || ""}
                  onChange={(value) => updateField("nickname", value)}
                />
                <InputArea
                  label="경력"
                  value={formData.careerYears ? String(formData.careerYears) : ""}
                  onChange={(value) => updateField("careerYears", Number(value) || 0)}
                  inputType="number"
                />
                <InputArea
                  label="한 줄 소개"
                  value={formData.oneLiner || ""}
                  onChange={(value) => updateField("oneLiner", value)}
                />

                <div className="mt-4 lg:hidden">
                  <TagForm
                    Tags={["소형이사", "가정이사", "사무실이사"]}
                    label="제공 서비스"
                    colType="flex"
                    selectedTags={selectedServices}
                    setSelectedTags={(tags) => {
                      setSelectedServices(tags);
                      updateField("services", tags);
                    }}
                  />
                  <TagForm
                    selectedTags={selectedRegions}
                    setSelectedTags={(tags) => {
                      setSelectedRegions(tags);
                      updateField("regions", tags);
                    }}
                    Tags={REGIONS}
                    label="가능구역"
                    colType="grid"
                  />
                </div>
              </div>

              <div className="mt-4 w-full">
                <InputArea
                  label="상세 설명"
                  type="textArea"
                  value={formData.description || ""}
                  onChange={(value) => updateField("description", value)}
                />
              </div>
            </div>

            <div className="hidden gap-4 lg:flex lg:w-1/2 lg:flex-col">
              <TagForm
                selectedTags={selectedServices}
                setSelectedTags={(tags) => {
                  setSelectedServices(tags);
                  updateField("services", tags);
                }}
                Tags={["소형이사", "가정이사", "사무실이사"]}
                label="상세설명"
                colType="flex"
              />
              <TagForm
                selectedTags={selectedRegions}
                setSelectedTags={(tags) => {
                  setSelectedRegions(tags);
                  updateField("regions", tags);
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
              disabled={loading}
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
