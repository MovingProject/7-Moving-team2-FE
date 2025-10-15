// useDriverProfileForm.ts 수정 (현재 버전 기준)

import { useState, useCallback } from "react";
import {
  isValidNickName,
  isValidHistory,
  isValidOverView,
  isValidDetails,
} from "@/utils/validation";
import { error } from "@/utils/constant/error";

interface DriverFormData {
  nickname: string;
  careerYears: number;
  oneLiner: string;
  description: string;
  selectedServices: string[];
  selectedRegions: string[];
}

export function useDriverProfileForm() {
  const [form, setForm] = useState<DriverFormData>({
    nickname: "",
    careerYears: 0,
    oneLiner: "",
    description: "",
    selectedServices: [],
    selectedRegions: [],
  });

  const [errors, setErrors] = useState({
    nicknameError: "",
    careerError: "",
    oneLinerError: "",
    descriptionError: "",
    servicesError: "",
    regionsError: "",
  });

  // ✅ 개별 필드 setter
  const setNickname = (value: string) => setForm((p) => ({ ...p, nickname: value }));
  const setCareerYears = (value: number) => setForm((p) => ({ ...p, careerYears: value }));
  const setOneLiner = (value: string) => setForm((p) => ({ ...p, oneLiner: value }));
  const setDescription = (value: string) => setForm((p) => ({ ...p, description: value }));
  const setSelectedServices = (value: string[]) =>
    setForm((p) => ({ ...p, selectedServices: value }));
  const setSelectedRegions = (value: string[]) =>
    setForm((p) => ({ ...p, selectedRegions: value }));

  // ✅ 유효성 검사
  const validateNickname = useCallback((value: string) => {
    if (!value.trim()) return error.nickNameEmpty;
    if (!isValidNickName(value)) return "별명을 2자 이상 입력해주세요.";
    return "";
  }, []);

  const validateCareer = useCallback((value: string) => {
    if (!value.trim()) return "경력을 입력해주세요.";
    if (!isValidHistory(value)) return error.histotyInvalid;
    return "";
  }, []);

  const validateOneLiner = useCallback((value: string) => {
    if (!value.trim()) return "한 줄 소개를 입력해주세요.";
    if (!isValidOverView(value)) return error.overViewInvalid;
    return "";
  }, []);

  const validateDescription = useCallback((value: string) => {
    if (!value.trim()) return "상세 설명을 입력해주세요.";
    if (!isValidDetails(value)) return error.details;
    return "";
  }, []);

  const validateServices = useCallback(
    (services: string[]) => (services.length === 0 ? error.service : ""),
    []
  );

  const validateRegions = useCallback(
    (regions: string[]) => (regions.length === 0 ? error.serviceArea : ""),
    []
  );

  // ✅ 전체 유효성 검사
  const validateAll = useCallback(() => {
    const newErrors = {
      nicknameError: validateNickname(form.nickname),
      careerError: validateCareer(String(form.careerYears)),
      oneLinerError: validateOneLiner(form.oneLiner),
      descriptionError: validateDescription(form.description),
      servicesError: validateServices(form.selectedServices),
      regionsError: validateRegions(form.selectedRegions),
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((v) => !v);
  }, [form]);

  // ✅ 초기화
  const resetForm = useCallback(() => {
    setForm({
      nickname: "",
      careerYears: 0,
      oneLiner: "",
      description: "",
      selectedServices: [],
      selectedRegions: [],
    });
    setErrors({
      nicknameError: "",
      careerError: "",
      oneLinerError: "",
      descriptionError: "",
      servicesError: "",
      regionsError: "",
    });
  }, []);

  // ✅ 초기 데이터 세팅
  const setInitialData = useCallback((data: Partial<DriverFormData>) => {
    setForm((prev) => ({
      ...prev,
      nickname: data.nickname ?? "",
      careerYears: data.careerYears ?? 0,
      oneLiner: data.oneLiner ?? "",
      description: data.description ?? "",
      selectedServices: data.selectedServices ?? [],
      selectedRegions: data.selectedRegions ?? [],
    }));
  }, []);

  const hasErrors = Object.values(errors).some((v) => !!v);
  const isFormComplete =
    !!form.nickname.trim() &&
    form.careerYears > 0 &&
    !!form.oneLiner.trim() &&
    !!form.description.trim() &&
    form.selectedServices.length > 0 &&
    form.selectedRegions.length > 0 &&
    !hasErrors;

  return {
    ...form,
    setNickname,
    setCareerYears,
    setOneLiner,
    setDescription,
    setSelectedServices,
    setSelectedRegions,

    // 기존 명명 규칙 복원
    ...errors,

    validateNickname,
    validateCareer,
    validateOneLiner,
    validateDescription,
    validateServices,
    validateRegions,
    validateAll,

    resetForm,
    setInitialData,

    hasErrors,
    isFormComplete,
  };
}
