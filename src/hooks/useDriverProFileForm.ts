import { useState } from "react";
import {
  isValidNickName,
  isValidHistory,
  isValidOverView,
  isValidDetails,
} from "@/utils/validation";
import { error } from "@/utils/constant/error";

export function useDriverProfileForm() {
  // 폼 데이터 상태
  const [nickname, setNickname] = useState<string>("");
  const [careerYears, setCareerYears] = useState<number>(0);
  const [oneLiner, setOneLiner] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);

  // 에러 상태들
  const [nicknameError, setNicknameError] = useState<string>("");
  const [careerError, setCareerError] = useState<string>("");
  const [oneLinerError, setOneLinerError] = useState<string>("");
  const [descriptionError, setDescriptionError] = useState<string>("");
  const [servicesError, setServicesError] = useState<string>("");
  const [regionsError, setRegionsError] = useState<string>("");

  // 유효성 검사 함수들
  const validateNickname = (value: string) => {
    if (!value.trim()) {
      setNicknameError(error.nickNameEmpty);
    } else if (!isValidNickName(value)) {
      setNicknameError("별명을 2자 이상 입력해주세요.");
    } else {
      setNicknameError("");
    }
  };

  const validateCareer = (value: string) => {
    if (!value.trim()) {
      setCareerError("경력을 입력해주세요.");
    } else if (!isValidHistory(value)) {
      setCareerError(error.histotyInvalid);
    } else {
      setCareerError("");
    }
  };

  const validateOneLiner = (value: string) => {
    if (!value.trim()) {
      setOneLinerError("한 줄 소개를 입력해주세요.");
    } else if (!isValidOverView(value)) {
      setOneLinerError(error.overViewInvalid);
    } else {
      setOneLinerError("");
    }
  };

  const validateDescription = (value: string) => {
    if (!value.trim()) {
      setDescriptionError("상세 설명을 입력해주세요.");
    } else if (!isValidDetails(value)) {
      setDescriptionError(error.details);
    } else {
      setDescriptionError("");
    }
  };

  const validateServices = (services: string[]) => {
    if (services.length === 0) {
      setServicesError(error.service);
    } else {
      setServicesError("");
    }
  };

  const validateRegions = (regions: string[]) => {
    if (regions.length === 0) {
      setRegionsError(error.serviceArea);
    } else {
      setRegionsError("");
    }
  };

  // 전체 유효성 검사
  const validateAll = () => {
    validateNickname(nickname);
    validateCareer(String(careerYears));
    validateOneLiner(oneLiner);
    validateDescription(description);
    validateServices(selectedServices);
    validateRegions(selectedRegions);

    return !(
      nicknameError ||
      careerError ||
      oneLinerError ||
      descriptionError ||
      servicesError ||
      regionsError
    );
  };

  // 폼 데이터 초기화
  const resetForm = () => {
    setNickname("");
    setCareerYears(0);
    setOneLiner("");
    setDescription("");
    setSelectedServices([]);
    setSelectedRegions([]);

    // 에러 상태 초기화
    setNicknameError("");
    setCareerError("");
    setOneLinerError("");
    setDescriptionError("");
    setServicesError("");
    setRegionsError("");
  };

  // 초기 데이터로 폼 설정
  const setInitialData = (data: {
    nickname?: string;
    careerYears?: number;
    oneLiner?: string;
    description?: string;
    services?: string[];
    regions?: string[];
  }) => {
    setNickname(data.nickname || "");
    setCareerYears(data.careerYears || 0);
    setOneLiner(data.oneLiner || "");
    setDescription(data.description || "");
    setSelectedServices(data.services || []);
    setSelectedRegions(data.regions || []);
  };

  return {
    // 상태들
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

    // 에러 상태들
    nicknameError,
    careerError,
    oneLinerError,
    descriptionError,
    servicesError,
    regionsError,

    // 유효성 검사 함수들
    validateNickname,
    validateCareer,
    validateOneLiner,
    validateDescription,
    validateServices,
    validateRegions,
    validateAll,

    // 유틸리티 함수들
    resetForm,
    setInitialData,

    // 전체 에러 여부
    hasErrors: !!(
      nicknameError ||
      careerError ||
      oneLinerError ||
      descriptionError ||
      servicesError ||
      regionsError
    ),

    // 모든 필수 필드가 완성되었는지 확인
    isFormComplete: !!(
      nickname.trim() &&
      careerYears > 0 &&
      oneLiner.trim() &&
      description.trim() &&
      selectedServices.length > 0 &&
      selectedRegions.length > 0 &&
      !nicknameError &&
      !careerError &&
      !oneLinerError &&
      !descriptionError &&
      !servicesError &&
      !regionsError
    ),
  };
}
