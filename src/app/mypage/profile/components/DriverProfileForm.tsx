"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import InputArea from "../../basicEdit/[id]/components/InputArea";
import ImageInputArea from "./ImageInputArea";
import TagForm from "./TagForm";
import Button from "@/components/ui/Button";
import { useDriverProfileForm } from "@/hooks/useDriverProFileForm";
import { useProfileQuery } from "@/hooks/useProfileQuery";
import type { AreaType } from "@/types/areaTypes";
import type { ServerMoveType } from "@/types/moveTypes";

// 지역 및 서비스 매핑
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
] as const;

const REGION_MAP: Record<string, string> = {
  서울: "SEOUL",
  경기: "GYEONGGI",
  인천: "INCHEON",
  강원: "GANGWON",
  충북: "CHUNGBUK",
  충남: "CHUNGNAM",
  세종: "SEJONG",
  대전: "DAEJEON",
  전북: "JEONBUK",
  전남: "JEONNAM",
  광주: "GWANGJU",
  경북: "GYEONGBUK",
  경남: "GYEONGNAM",
  대구: "DAEGU",
  울산: "ULSAN",
  부산: "BUSAN",
  제주: "JEJU",
};

const SERVICE_MAP: Record<string, string> = {
  소형이사: "SMALL_MOVE",
  가정이사: "HOME_MOVE",
  사무실이사: "OFFICE_MOVE",
};

const REVERSE_REGION_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(REGION_MAP).map(([ko, en]) => [en, ko])
);

const REVERSE_SERVICE_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(SERVICE_MAP).map(([ko, en]) => [en, ko])
);

export default function DriverProfileForm() {
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
    isFormComplete,
  } = useDriverProfileForm();

  const router = useRouter();

  const {
    user: userData,
    createDriverProfile,
    isCreatingDriverProfile,
    createDriverProfileError,
    error: profileError,
    refetch,
  } = useProfileQuery();

  const [loading, setLoading] = useState(false);

  // 폼 제출 (등록)
  const handleSubmit = async () => {
    if (!validateAll()) return;

    setLoading(true);
    try {
      const backendServices = selectedServices.map((s) => SERVICE_MAP[s] ?? s) as ServerMoveType[];
      const backendRegions = selectedRegions.map((r) => REGION_MAP[r] ?? r) as AreaType[];

      await createDriverProfile({
        nickname,
        careerYears,
        oneLiner,
        description,
        serviceTypes: backendServices,
        serviceAreas: backendRegions,
      });

      await refetch();
      alert("프로필이 성공적으로 등록되었습니다!");
      router.push("/mypage");
    } catch (err) {
      console.error("[DriverProfileForm] 프로필 등록 오류:", err);
      alert("등록 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const isLoading = loading || isCreatingDriverProfile;
  const errorMessage = createDriverProfileError?.message ?? profileError ?? null;

  return (
    <div className="flex items-center justify-center">
      <div className="mt-5 flex w-full max-w-[424px] flex-col items-center justify-center p-6 lg:max-w-[1200px]">
        <div className="flex w-full flex-col lg:flex-row lg:gap-15">
          <div className="flex w-full flex-col gap-4 lg:w-1/2">
            <div className="w-full">
              <div className="mb-6 flex w-full flex-col">
                <p className="w-full pb-4 text-[18px] leading-[26px] font-bold text-[#1F1F1F]">
                  기사님 프로필 등록
                </p>
                {errorMessage && (
                  <p className="text-sm text-red-500">
                    {typeof errorMessage === "string" ? errorMessage : "오류가 발생했습니다."}
                  </p>
                )}
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
                  Tags={Object.keys(SERVICE_MAP)}
                  label="제공 서비스"
                  colType="flex"
                  selectedTags={selectedServices}
                  setSelectedTags={(tags) => {
                    setSelectedServices(tags);
                    validateServices(tags);
                  }}
                  multiSelect={true}
                />
                <TagForm
                  selectedTags={selectedRegions}
                  setSelectedTags={(tags) => {
                    setSelectedRegions(tags);
                    validateRegions(tags);
                  }}
                  Tags={REGIONS as unknown as string[]}
                  label="가능구역"
                  colType="grid"
                  multiSelect={true}
                />
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
              Tags={Object.keys(SERVICE_MAP)}
              label="제공 서비스"
              colType="flex"
              multiSelect={true}
            />
            <TagForm
              selectedTags={selectedRegions}
              setSelectedTags={(tags) => {
                setSelectedRegions(tags);
                validateRegions(tags);
              }}
              Tags={REGIONS as unknown as string[]}
              label="가능구역"
              colType="grid"
              multiSelect={true}
            />
          </div>
        </div>

        <div className="mt-4 flex w-full flex-col gap-3 lg:w-full lg:flex-row">
          <Button
            className="w-full"
            text={isLoading ? "등록 중..." : "등록하기"}
            onClick={handleSubmit}
            disabled={isLoading || !isFormComplete}
          />
        </div>
      </div>
    </div>
  );
}
