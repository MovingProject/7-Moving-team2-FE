"use client";

import { useEffect, useState } from "react";
import InputArea from "../../basicEdit/[id]/components/InputArea";
import ImageInputArea from "./ImageInputArea";
import TagForm from "./TagForm";
import Button from "@/components/ui/Button";
import { useDriverProfileForm } from "@/hooks/useDriverProFileForm";
import { useProfileQuery } from "@/hooks/useProfileQuery";
import { UpdateDriverProfileRequest, DriverProfileData } from "@/types/card";

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

// 한글 지역명 → 백엔드 enum 값 매핑
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

// 한글 서비스명 → 백엔드 enum 값 매핑
const SERVICE_MAP: Record<string, string> = {
  소형이사: "SMALL_MOVE",
  가정이사: "HOME_MOVE",
  사무실이사: "OFFICE_MOVE",
};

// 역매핑: 백엔드 enum → 한글
const REVERSE_REGION_MAP: Record<string, string> = Object.entries(REGION_MAP).reduce(
  (acc, [ko, en]) => {
    acc[en] = ko;
    return acc;
  },
  {} as Record<string, string>
);

const REVERSE_SERVICE_MAP: Record<string, string> = Object.entries(SERVICE_MAP).reduce(
  (acc, [ko, en]) => {
    acc[en] = ko;
    return acc;
  },
  {} as Record<string, string>
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

  const {
    user: userData,
    updateProfile,
    isUpdatingProfile,
    updateProfileError,
    error: profileError,
  } = useProfileQuery();

  const driverProfile =
    userData?.role === "DRIVER" ? (userData.profile as DriverProfileData | null) : null;

  const isEditMode = !!driverProfile;
  const [loading, setLoading] = useState(false);

  // 초기 데이터 세팅
  useEffect(() => {
    if (driverProfile) {
      // 백엔드 enum 값을 한글로 변환
      const koreanServices = (driverProfile.driverServiceTypes ?? []).map(
        (service) => REVERSE_SERVICE_MAP[service] ?? service
      );

      const koreanRegions = (driverProfile.driverServiceAreas ?? []).map(
        (region) => REVERSE_REGION_MAP[region] ?? region
      );

      const careerNum = Number(driverProfile.careerYears) || 0;

      setInitialData({
        nickname: driverProfile.nickname || "",
        careerYears: careerNum,
        oneLiner: driverProfile.oneLiner ?? "",
        description: description,
        services: koreanServices,
        regions: koreanRegions,
      });
    }
  }, [driverProfile, setInitialData, description]);

  // 폼 제출
  const handleSubmit = async () => {
    if (!validateAll()) {
      console.log("유효성 검사 실패");
      return;
    }

    setLoading(true);

    try {
      // 한글 선택값을 백엔드 enum 값으로 변환
      const backendServices = selectedServices.map((s) => SERVICE_MAP[s] ?? s);
      const backendRegions = selectedRegions.map((r) => REGION_MAP[r] ?? r);

      const dto: UpdateDriverProfileRequest = {
        driverProfile: {
          nickname,
          careerYears: String(careerYears),
          oneLiner,
          description,
          driverServiceTypes: backendServices,
          driverServiceAreas: backendRegions,
        },
      };

      await updateProfile(dto);
      alert("프로필이 수정되었습니다!");
    } catch (err) {
      console.error("프로필 수정 중 오류:", err);
      alert("프로필 수정 중 문제가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 취소하기 (초기 상태로 복원)
  const handleCancel = () => {
    if (driverProfile) {
      const koreanServices = (driverProfile.driverServiceTypes ?? []).map(
        (service) => REVERSE_SERVICE_MAP[service] ?? service
      );

      const koreanRegions = (driverProfile.driverServiceAreas ?? []).map(
        (region) => REVERSE_REGION_MAP[region] ?? region
      );

      const careerNum = Number(driverProfile.careerYears) || 0;

      setInitialData({
        nickname: driverProfile.nickname || "",
        careerYears: careerNum,
        oneLiner: driverProfile.oneLiner ?? "",
        description: description,
        services: koreanServices,
        regions: koreanRegions,
      });
    }
  };

  const isLoading = loading || isUpdatingProfile;
  const errorMessage = updateProfileError?.message ?? profileError ?? null;

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
                label="제공 서비스"
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
              disabled={isLoading || !isFormComplete}
              onClick={handleSubmit}
            />
            {isEditMode && (
              <Button
                className="w-full lg:order-1"
                variant="secondary"
                text="취소"
                disabled={isLoading}
                onClick={handleCancel}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
