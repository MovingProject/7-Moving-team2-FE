"use client";

import InputArea from "../../basicEdit/[id]/components/InputArea";
import ImageInputArea from "../components/ImageInputArea";
import TagForm from "../components/TagForm";
import Button from "@/components/ui/Button";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProfileQuery } from "@/hooks/useProfileQuery";
import { updateUserProfile } from "@/utils/hook/profile/profile";
import { useUserStore } from "@/store/userStore";
import { UpdateUserProfileRequest } from "@/types/card";

export default function DriverProfileEdit() {
  const router = useRouter();
  const { setUser } = useUserStore();
  const { user, isLoading, error } = useProfileQuery();
  console.log("🚩 user data 확인:", user);

  // Tag 목록
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
  const moveTypes = ["소형이사", "가정이사", "사무실이사"];

  // 입력값 상태
  const [nickname, setNickname] = useState("");
  const [careerYears, setCareerYears] = useState("");
  const [oneLiner, setOneLiner] = useState("");
  const [description, setDescription] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // user 데이터 불러오면 input 초기화
  useEffect(() => {
    if (user?.role === "DRIVER" && user.profile) {
      setNickname(user.profile.nickname ?? "");
      setCareerYears(user.profile.careerYears ?? "");
      setOneLiner(user.profile.oneLiner ?? "");
      setDescription(user.profile.description ?? "");
      setSelectedServices(user.profile.driverServiceTypes ?? []);
      setSelectedRegions(user.profile.driverServiceAreas ?? []);
    }
  }, [user]);

  const handleCancel = () => router.push("/mypage/profile");

  const handleSubmit = async () => {
    if (user?.role !== "DRIVER") {
      alert("드라이버 계정만 수정 가능합니다.");
      return;
    }

    setLoading(true);
    try {
      const dto: UpdateUserProfileRequest = {
        driverProfile: {
          nickname,
          careerYears,
          oneLiner,
          description,
          driverServiceTypes: selectedServices,
          driverServiceAreas: selectedRegions,
        },
      };

      const updated = await updateUserProfile(dto);
      setUser(updated);
      alert("프로필이 성공적으로 수정되었습니다!");
      router.push("/mypage/profile");
    } catch (err) {
      console.error("[DriverProfileEdit] 프로필 수정 실패:", err);
      alert("수정 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) return <div className="p-10 text-center">로딩 중...</div>;
  if (error || !user)
    return <div className="p-10 text-center">프로필 정보를 불러오지 못했습니다.</div>;
  if (user.role !== "DRIVER")
    return <div className="p-10 text-center">드라이버 전용 페이지입니다.</div>;

  return (
    <div className="flex items-center justify-center">
      <div className="mt-5 flex w-full max-w-[424px] flex-col items-center justify-center p-6 lg:max-w-[1200px]">
        <div className="flex w-full flex-col lg:flex-row lg:gap-15">
          <div className="flex w-full flex-col gap-4 lg:w-1/2">
            <div className="w-full">
              <div className="flex w-full">
                <p className="w-full border-b border-[#F2F2F2] pb-4 text-[18px] leading-[26px] font-bold text-[#1F1F1F]">
                  프로필수정
                </p>
              </div>
              <InputArea label="별명" value={nickname} onChange={setNickname} />
              <ImageInputArea />
              <InputArea label="경력" value={careerYears} onChange={setCareerYears} />
              <InputArea label="한 줄 소개" value={oneLiner} onChange={setOneLiner} />

              <div className="mt-4 lg:hidden">
                <TagForm
                  Tags={["소형이사", "가정이사", "사무실이사"]}
                  label="상세설명"
                  colType="flex"
                  selectedTags={selectedServices}
                  setSelectedTags={setSelectedServices}
                />
                <TagForm
                  selectedTags={selectedServices}
                  setSelectedTags={setSelectedServices}
                  Tags={regions}
                  label="가능구역"
                  colType="grid"
                />
              </div>
            </div>

            <div className="mt-4 w-full">
              <InputArea
                label="상세 설명"
                value={description}
                onChange={setDescription}
                type="textArea"
              />
            </div>
          </div>

          <div className="hidden gap-4 lg:flex lg:w-1/2 lg:flex-col">
            <TagForm
              selectedTags={selectedServices}
              setSelectedTags={setSelectedServices}
              Tags={["소형이사", "가정이사", "사무실이사"]}
              label="상세설명"
              colType="flex"
            />
            <TagForm
              selectedTags={selectedServices}
              setSelectedTags={setSelectedServices}
              Tags={regions}
              label="가능구역"
              colType="grid"
            />
          </div>
        </div>

        <div className="mt-4 flex w-full flex-col gap-3 lg:w-full lg:flex-row">
          <Button className="w-full lg:order-2" text="수정하기" onClick={handleSubmit} />
          <Button
            className="w-full lg:order-1"
            variant="secondary"
            text="취소"
            onClick={handleCancel}
          />
        </div>
      </div>
    </div>
  );
}
