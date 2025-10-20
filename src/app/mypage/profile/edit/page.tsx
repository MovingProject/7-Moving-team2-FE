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
import { useQueryClient } from "@tanstack/react-query";

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

// 한글 <-> 백엔드 enum 매핑
const SERVICE_MAP: Record<string, string> = {
  소형이사: "SMALL_MOVE",
  가정이사: "HOME_MOVE",
  사무실이사: "OFFICE_MOVE",
};

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

// 역매핑 (enum -> 한글)
const REVERSE_SERVICE_MAP = Object.fromEntries(
  Object.entries(SERVICE_MAP).map(([ko, en]) => [en, ko])
);
const REVERSE_REGION_MAP = Object.fromEntries(
  Object.entries(REGION_MAP).map(([ko, en]) => [en, ko])
);

export default function DriverProfileEdit() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setUser } = useUserStore();
  const { user, isLoading, error } = useProfileQuery();
  console.log("🚩 user data 확인:", user);

  // tag 목록
  const regions = Object.keys(REGION_MAP);
  const moveTypes = Object.keys(SERVICE_MAP);

  // 입력 상태
  const [nickname, setNickname] = useState("");
  const [careerYears, setCareerYears] = useState<number>(0);
  const [oneLiner, setOneLiner] = useState("");
  const [description, setDescription] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // 드라이버 프로필 수정 페이지 진입 시 캐시 무효화
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["userProfile"] });
  }, [queryClient]);

  /** 최초 로드 시 user 데이터 zustand에 반영 (1회만) */
  useEffect(() => {
    if (user) setUser(user);
  }, [user?.userId]);

  // 초기값 세팅
  useEffect(() => {
    if (!user || user.role !== "DRIVER" || !user.profile) return;
    const profile = user.profile;

    // 이미 초기화된 상태라면 다시 세팅하지 않음
    if (nickname || oneLiner || description) return;

    setNickname(profile.nickname ?? "");
    setCareerYears(profile.careerYears ?? 0);
    setOneLiner(profile.oneLiner ?? "");
    setDescription(profile.description ?? "");

    if (profile.driverServiceTypes) {
      const serviceKo = profile.driverServiceTypes
        .map((t) => REVERSE_SERVICE_MAP[t])
        .filter(Boolean);
      setSelectedServices(serviceKo);
    }

    if (profile.driverServiceAreas) {
      const areaKo = profile.driverServiceAreas.map((a) => REVERSE_REGION_MAP[a]).filter(Boolean);
      setSelectedRegions(areaKo);
    }
  }, [user]); // user가 바뀌었을 때만 실행

  const handleCancel = () => router.push("/mypage");

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
          // 한글 → enum 매핑 변환
          driverServiceTypes: selectedServices.map((s) => SERVICE_MAP[s]),
          driverServiceAreas: selectedRegions.map((r) => REGION_MAP[r]),
        },
      };

      const updatedUser = await updateUserProfile(dto);
      setUser(updatedUser); // zustand 즉시 반영
      alert("프로필이 성공적으로 수정되었습니다!");
      if (user?.role === "DRIVER") router.push("/mypage");
      else router.back();
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
              <InputArea
                label="경력"
                value={careerYears ? String(careerYears) : ""}
                onChange={(value) => setCareerYears(Number(value) || 0)}
              />
              <InputArea label="한 줄 소개" value={oneLiner} onChange={setOneLiner} />

              <div className="mt-4 lg:hidden">
                <TagForm
                  Tags={moveTypes}
                  label="상세설명"
                  colType="flex"
                  selectedTags={selectedServices}
                  setSelectedTags={setSelectedServices}
                />
                <TagForm
                  selectedTags={selectedRegions}
                  setSelectedTags={setSelectedRegions}
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
              Tags={moveTypes}
              label="상세설명"
              colType="flex"
            />
            <TagForm
              selectedTags={selectedRegions}
              setSelectedTags={setSelectedRegions}
              Tags={regions}
              label="가능구역"
              colType="grid"
            />
          </div>
        </div>

        <div className="mt-4 flex w-full flex-col gap-3 lg:w-full lg:flex-row">
          <Button
            className="w-full lg:order-2"
            text={loading ? "수정 중..." : "수정하기"}
            onClick={handleSubmit}
            disabled={loading}
          />
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
