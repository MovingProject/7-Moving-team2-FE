// useDriverProfileForm.ts 수정 (현재 버전 기준)

import { useState, useCallback, useMemo } from "react";
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

  const setNickname = (value: string) => setForm((p) => ({ ...p, nickname: value }));
  const setCareerYears = (value: number) => setForm((p) => ({ ...p, careerYears: value }));
  const setOneLiner = (value: string) => setForm((p) => ({ ...p, oneLiner: value }));
  const setDescription = (value: string) => setForm((p) => ({ ...p, description: value }));
  const setSelectedServices = (value: string[]) =>
    setForm((p) => ({ ...p, selectedServices: value }));
  const setSelectedRegions = (value: string[]) =>
    setForm((p) => ({ ...p, selectedRegions: value }));

  const validateNickname = useCallback((value: string) => {
    let message = "";
    if (!value.trim()) message = error.nickNameEmpty;
    else if (!isValidNickName(value)) message = "별명을 2자 이상 입력해주세요.";

    setErrors((prev) => ({ ...prev, nicknameError: message }));
    return message;
  }, []);

  const validateCareer = useCallback((value: string) => {
    let message = "";
    if (!value.trim()) message = "경력을 입력해주세요.";
    else if (!isValidHistory(value)) message = error.historyInvalid;

    setErrors((prev) => ({ ...prev, careerError: message }));
    return message;
  }, []);

  const validateOneLiner = useCallback((value: string) => {
    let message = "";
    if (!value.trim()) message = "한 줄 소개를 입력해주세요.";
    else if (!isValidOverView(value)) message = error.overViewInvalid;

    setErrors((prev) => ({ ...prev, oneLinerError: message }));
    return message;
  }, []);

  const validateDescription = useCallback((value: string) => {
    let message = "";
    if (!value.trim()) message = "상세 설명을 입력해주세요.";
    else if (!isValidDetails(value)) message = error.details;

    setErrors((prev) => ({ ...prev, descriptionError: message }));
    return message;
  }, []);

  const validateServices = useCallback((services: string[]) => {
    const message = services.length === 0 ? error.service : "";
    setErrors((prev) => ({ ...prev, servicesError: message }));
    return message;
  }, []);

  const validateRegions = useCallback((regions: string[]) => {
    const message = regions.length === 0 ? error.serviceArea : "";
    setErrors((prev) => ({ ...prev, regionsError: message }));
    return message;
  }, []);

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
  }, [
    form,
    validateNickname,
    validateCareer,
    validateOneLiner,
    validateDescription,
    validateServices,
    validateRegions,
  ]);

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

  const isFormComplete = useMemo(() => {
    const hasErrors = Object.values(errors).some((v) => !!v);
    return (
      !!form.nickname.trim() &&
      form.careerYears > 0 &&
      !!form.oneLiner.trim() &&
      !!form.description.trim() &&
      form.selectedServices.length > 0 &&
      form.selectedRegions.length > 0 &&
      !hasErrors
    );
  }, [form, errors]);

  const hasErrors = useMemo(() => Object.values(errors).some((v) => !!v), [errors]);

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
