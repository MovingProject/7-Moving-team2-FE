"use client";

import InputArea from "../../basicEdit/[id]/components/InputArea";
import ImageInputArea from "../components/ImageInputArea";
import TagForm from "../components/TagForm";
import Button from "@/components/ui/Button";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useProfileQuery } from "@/hooks/useProfileQuery";
import { updateUserProfile } from "@/utils/hook/profile/profile";
import { useUserStore } from "@/store/userStore";
import { UpdateUserProfileRequest } from "@/types/card";
import { useQueryClient } from "@tanstack/react-query";
import {
  isValidNickName,
  isValidHistory,
  isValidOverView,
  isValidDetails,
} from "@/utils/validation";
import { error as ERR } from "@/utils/constant/error";

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

  const [errors, setErrors] = useState({
    nickname: "",
    career: "",
    oneLiner: "",
    description: "",
    services: "",
    regions: "",
  });

  // 개별 검증 (입력 시마다 즉시 반영)
  const validateNickname = useCallback((v: string) => {
    let msg = "";
    if (!v.trim()) msg = ERR.nickNameEmpty;
    else if (!isValidNickName(v)) msg = "별명을 2자 이상 입력해주세요.";
    setErrors((p) => ({ ...p, nickname: msg }));
    return msg;
  }, []);

  const validateCareer = useCallback((v: string) => {
    let msg = "";
    if (!v.trim()) msg = "경력을 입력해주세요.";
    else if (!isValidHistory(v)) msg = ERR.historyInvalid;
    setErrors((p) => ({ ...p, career: msg }));
    return msg;
  }, []);

  const validateOneLiner = useCallback((v: string) => {
    let msg = "";
    if (!v.trim()) msg = "한 줄 소개를 입력해주세요.";
    else if (!isValidOverView(v)) msg = ERR.overViewInvalid; // (>= 8자)
    setErrors((p) => ({ ...p, oneLiner: msg }));
    return msg;
  }, []);

  const validateDescription = useCallback((v: string) => {
    let msg = "";
    if (!v.trim()) msg = "상세 설명을 입력해주세요.";
    else if (!isValidDetails(v)) msg = ERR.details; // (>= 10자)
    setErrors((p) => ({ ...p, description: msg }));
    return msg;
  }, []);

  const validateServices = useCallback((arr: string[]) => {
    const msg = arr.length === 0 ? ERR.service : "";
    setErrors((p) => ({ ...p, services: msg }));
    return msg;
  }, []);

  const validateRegions = useCallback((arr: string[]) => {
    const msg = arr.length === 0 ? ERR.serviceArea : "";
    setErrors((p) => ({ ...p, regions: msg }));
    return msg;
  }, []);

  // 전체 검증
  const runAllValidations = useCallback(() => {
    const next = {
      nickname: validateNickname(nickname),
      career: validateCareer(String(careerYears)),
      oneLiner: validateOneLiner(oneLiner),
      description: validateDescription(description),
      services: validateServices(selectedServices),
      regions: validateRegions(selectedRegions),
    };
    setErrors(next);
    return Object.values(next).every((m) => !m);
  }, [
    nickname,
    careerYears,
    oneLiner,
    description,
    selectedServices,
    selectedRegions,
    validateNickname,
    validateCareer,
    validateOneLiner,
    validateDescription,
    validateServices,
    validateRegions,
  ]);

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

    setErrors({
      nickname: "",
      career: "",
      oneLiner: "",
      description: "",
      services: "",
      regions: "",
    });
  }, [user]);

  const isFormValid = useMemo(() => {
    const hasErrors = Object.values(errors).some(Boolean);
    const filled =
      !!nickname.trim() &&
      careerYears > 0 &&
      !!oneLiner.trim() &&
      !!description.trim() &&
      selectedServices.length > 0 &&
      selectedRegions.length > 0;
    return filled && !hasErrors;
  }, [nickname, careerYears, oneLiner, description, selectedServices, selectedRegions, errors]);

  const handleCancel = () => router.push("/mypage");

  const handleSubmit = async () => {
    if (user?.role !== "DRIVER") {
      alert("드라이버 계정만 수정 가능합니다.");
      return;
    }
    if (selectedServices.length === 0) {
      alert("제공 서비스를 최소 1개 이상 선택해주세요.");
      return;
    }
    if (selectedRegions.length === 0) {
      alert("가능 구역을 최소 1개 이상 선택해주세요.");
      return;
    }
    if (!runAllValidations()) {
      alert("입력하신 내용을 다시 확인해주세요.");
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
                <p className="w-full border-b border-[#F2F2F2] pb-4 text-xl leading-[26px] font-bold text-gray-900 lg:text-3xl">
                  프로필수정
                </p>
              </div>
              <InputArea
                label="별명"
                value={nickname}
                onChange={(v) => {
                  setNickname(v);
                  validateNickname(v);
                }}
                error={errors.nickname}
                placeholder="사이트에 노출될 별명을 입력해 주세요"
              />
              <ImageInputArea />
              <InputArea
                label="경력"
                value={careerYears ? String(careerYears) : ""}
                onChange={(v) => {
                  const n = Number(v) || 0;
                  setCareerYears(n);
                  validateCareer(String(n));
                }}
                inputType="number"
                error={errors.career}
                placeholder="기사님의 경력을 입력해 주세요"
              />
              <InputArea
                label="한 줄 소개"
                value={oneLiner}
                onChange={(v) => {
                  setOneLiner(v);
                  validateOneLiner(v);
                }}
                error={errors.oneLiner}
                placeholder="8자 이상으로 입력해 주세요"
              />

              <div className="mt-4 lg:hidden">
                <TagForm
                  Tags={moveTypes}
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
                  Tags={regions}
                  label="가능구역"
                  colType="grid"
                  multiSelect={true}
                />
              </div>
            </div>

            <div className="mt-4 w-full">
              <InputArea
                label="상세 설명"
                value={description}
                onChange={(v) => {
                  setDescription(v);
                  validateDescription(v);
                }}
                error={errors.description}
                type="textArea"
                placeholder="10자 이상으로 입력해 주세요"
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
              Tags={moveTypes}
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
              Tags={regions}
              label="가능구역"
              colType="grid"
              multiSelect={true}
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
