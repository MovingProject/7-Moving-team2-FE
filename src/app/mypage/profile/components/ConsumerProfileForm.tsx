"use client";

import React, { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import TagForm from "./TagForm";
import { useRouter } from "next/navigation";
import ImageInputArea from "./ImageInputArea";
import InputArea from "../../basicEdit/[id]/components/InputArea";
import clsx from "clsx";
import { useProfileQuery } from "@/hooks/useProfileQuery";
import { UpdateConsumerProfileRequest, ConsumerProfileData } from "@/types/card";

const REGIONS = [
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
const REVERSE_REGION_MAP = Object.fromEntries(
  Object.entries(REGION_MAP).map(([ko, en]) => [en, ko])
);
const REVERSE_SERVICE_MAP = Object.fromEntries(
  Object.entries(SERVICE_MAP).map(([ko, en]) => [en, ko])
);

export default function ConsumerProfileForm() {
  const router = useRouter();
  const { user, updateProfile, updateBasicInfo, isLoading, error: queryError } = useProfileQuery();

  const consumerProfile =
    user?.role === "CONSUMER" ? (user.profile as ConsumerProfileData | null) : null;

  // 기본 회원 정보
  const [name, setName] = useState("");
  const [email] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(user?.phoneNumber ?? "");

  // 비밀번호 입력값
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");

  // 지역, 서비스 선택
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);

  const [submitting, setSubmitting] = useState(false);
  const isEditMode = !!consumerProfile;

  // 초기 데이터 세팅
  useEffect(() => {
    if (!consumerProfile) return;

    // 서비스 변환 (백엔드 → 한글)
    if (consumerProfile.serviceType) {
      const serviceKo = REVERSE_SERVICE_MAP[consumerProfile.serviceType];
      if (serviceKo) setSelectedServices([serviceKo]);
    }

    // 지역 변환 (백엔드 → 한글)
    if (consumerProfile.areas) {
      const areaKo = REVERSE_REGION_MAP[consumerProfile.areas];
      if (areaKo) setSelectedAreas([areaKo]);
    }

    setName(user?.name ?? "");
    setPhone(user?.phoneNumber ?? "");
  }, [consumerProfile, user]);

  // 비밀번호 검증
  const validatePassword = (): boolean => {
    if (newPw && newPw !== confirmPw) {
      alert("새 비밀번호가 일치하지 않습니다.");
      return false;
    }
    if (newPw && !currentPw) {
      alert("새 비밀번호를 설정하려면 현재 비밀번호를 입력해주세요.");
      return false;
    }
    return true;
  };

  // 취소하기
  const handleCancel = () => router.push("/mypage");

  // 폼 제출 (등록 / 수정)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validatePassword()) {
      return;
    }

    setSubmitting(true);

    try {
      const serviceType =
        selectedServices.length > 0
          ? SERVICE_MAP[selectedServices[0]]
          : consumerProfile?.serviceType;
      const areas =
        selectedAreas.length > 0 ? REGION_MAP[selectedAreas[0]] : consumerProfile?.areas;

      const dto: UpdateConsumerProfileRequest = {
        name,
        phoneNumber: phone,
        currentPassword: currentPw || undefined,
        newPassword: newPw || undefined,
        consumerProfile: {
          ...(serviceType ? { serviceType } : {}),
          ...(areas ? { areas } : {}),
          ...(consumerProfile?.image ? { image: consumerProfile.image } : {}),
        },
      };

      await updateProfile(dto);

      alert("프로필이 성공적으로 수정되었습니다!");
      router.push("/mypage");
    } catch (err) {
      console.error("프로필 수정 중 오류:", err);
      alert("프로필 수정 중 문제가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  // layout class 계산
  const layoutClasses = !isEditMode ? "lg:max-w-[686px]" : "";

  return (
    <div className={clsx("container mx-auto px-4", layoutClasses)}>
      <div className="flex flex-col items-center justify-center pt-6 pb-10 lg:gap-10 lg:pt-10 lg:pb-16">
        <div className="flex w-full flex-col gap-4 border-b border-gray-200 pb-4 lg:gap-8 lg:pb-8">
          <h2 className="text-2xl font-bold text-gray-800 lg:text-3xl">
            프로필 {isEditMode ? "수정" : "등록"}
          </h2>
          {!isEditMode && (
            <p className="text-xs text-gray-600 lg:text-lg">
              추가 정보를 입력하여 회원가입을 완료해주세요.
            </p>
          )}
          {queryError && (
            <p className="text-sm text-red-500">
              {typeof queryError === "string" ? queryError : "오류가 발생했습니다."}
            </p>
          )}
        </div>
        <form onSubmit={handleSubmit} className="w-full space-y-8">
          <div className="lg flex flex-col gap-6 lg:flex-row lg:gap-18">
            {isEditMode && (
              <div className="flex w-full flex-col gap-6">
                <InputArea
                  label="이름"
                  value={name}
                  onChange={setName}
                  className="!max-w-full border-0 bg-gray-100"
                />
                <InputArea
                  label="이메일"
                  value={email}
                  onChange={() => {}}
                  className="pointer-events-none !max-w-full border-0 bg-gray-100 text-gray-400"
                />
                <InputArea
                  label="전화번호"
                  value={phone}
                  onChange={setPhone}
                  className="!max-w-full border-0 bg-gray-100"
                />
                <InputArea
                  label="현재 비밀번호"
                  type="basic"
                  inputType="password"
                  value={currentPw}
                  onChange={setCurrentPw}
                  placeholder="현재 비밀번호를 입력해주세요"
                  className="!max-w-full border-0 bg-gray-100"
                />
                <InputArea
                  label="새 비밀번호"
                  type="basic"
                  inputType="password"
                  value={newPw}
                  onChange={setNewPw}
                  placeholder="새 비밀번호를 입력해주세요"
                  className="!max-w-full border-0 bg-gray-100"
                />
                <InputArea
                  label="새 비밀번호 확인"
                  type="basic"
                  inputType="password"
                  value={confirmPw}
                  onChange={setConfirmPw}
                  placeholder="새 비밀번호를 다시 입력해주세요"
                  className="!max-w-full border-0 bg-gray-100"
                />
              </div>
            )}
            <div className="flex w-full flex-col gap-6">
              <ImageInputArea className="py-8" />
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
                selectedTags={selectedAreas}
                setSelectedTags={setSelectedAreas}
                Tags={REGIONS}
                label="내가 사는 지역"
                subText="*내가 사는 지역은 언제든 수정 가능해요!"
                colType="grid"
              />
            </div>
          </div>

          {/* 저장 버튼 */}
          <div className="mt-8 flex w-full flex-col justify-end gap-4 pt-4 lg:flex-row lg:gap-10">
            {isEditMode && (
              <Button
                type="button"
                variant="secondary"
                className="w-full px-8 py-2"
                text="취소하기"
                onClick={handleCancel}
              />
            )}
            <Button
              type="submit"
              className="w-full px-8 py-2"
              disabled={submitting || isLoading}
              text={
                submitting || isLoading
                  ? `${isEditMode ? "수정" : "등록"} 중...`
                  : `${isEditMode ? "수정하기" : "시작하기"}`
              }
            />
          </div>
        </form>
      </div>
    </div>
  );
}
