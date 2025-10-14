"use client";

import React, { useState, useEffect } from "react";
import { AreaType } from "@/types/areaTypes";
import Button from "@/components/ui/Button";
import TagForm from "./TagForm";
import { useRouter } from "next/navigation";
import ImageInputArea from "./ImageInputArea";
import InputArea from "../../basicEdit/[id]/components/InputArea";
import clsx from "clsx";
import { useProfileQuery } from "@/hooks/useProfileQuery";
import { UpdateUserProfileDto } from "@/types/profile";
import { ServerMoveType } from "@/types/moveTypes";

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

export default function ConsumerProfileForm() {
  const router = useRouter();
  const { data: userData, updateProfile, isLoading } = useProfileQuery();
  const consumerProfile = userData?.role === "CONSUMER" ? userData.profile : null;

  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // 기본 회원 정보
  const [name, setName] = useState(userData?.name ?? "");
  const [email] = useState(userData?.email ?? "");
  const [phone, setPhone] = useState(userData?.phoneNumber ?? "");

  // 비밀번호 입력값
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");

  const isEditMode = !!consumerProfile;

  // 초기 데이터 세팅
  useEffect(() => {
    if (consumerProfile) {
      setSelectedServices(consumerProfile.serviceType || []);
      setSelectedAreas(consumerProfile.areas || []);
    }
  }, [consumerProfile]);

  // 취소하기
  const handleCancel = () => {
    router.push("/mypage");
  };

  // 폼 제출 (등록 / 수정)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const dto: UpdateUserProfileDto = {
      consumerProfile: {
        serviceType: selectedServices as ServerMoveType[],
        areas: selectedAreas as AreaType[],
      },
    };

    try {
      await updateProfile(dto);
      alert("프로필이 성공적으로 수정되었습니다!");
    } catch (err) {
      console.error("프로필 수정 중 오류:", err);
      alert("프로필 수정 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
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
                selectedTags={selectedServices}
                setSelectedTags={setSelectedServices}
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
                type="submit"
                variant="secondary"
                className="w-full px-8 py-2"
                text="취소하기"
              />
            )}
            <Button
              type="submit"
              className="w-full px-8 py-2"
              disabled={loading}
              text={
                loading
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
