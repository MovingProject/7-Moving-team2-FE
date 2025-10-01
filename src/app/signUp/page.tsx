"use client";

import Link from "next/link";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import LogoText from "@/components/ui/LogoText";
import SlidToggle from "@/components/ui/SlidToggle";
import { useState } from "react";
import { useAuthForm } from "@/hooks/useAuthForm";
import Google from "@/assets/icon/google.svg";
import Kakao from "@/assets/icon/kakao.svg";
import Naver from "@/assets/icon/naver.svg";
import Image from "next/image";
import React from "react";
import { useSignup, type SignUpDTO } from "@/utils/hook/signup/api";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Signup() {
  const fields = [
    { key: "userName", label: "이름", placeholder: "성함을 입력해 주세요" },
    { key: "email", label: "이메일", placeholder: "이메일을 입력해 주세요", inputType: "email" },
    {
      key: "callNumber",
      label: "전화번호",
      placeholder: "전화번호를 입력해 주세요",
      inputType: "tel",
    },
    {
      key: "pw",
      label: "비밀번호",
      placeholder: "비밀번호를 입력해 주세요",
      inputType: "password",
    },
    {
      key: "pwCheck",
      label: "비밀번호 확인",
      placeholder: "비밀번호를 한 번 더 입력해 주세요",
      inputType: "password",
    },
  ];

  // local UI state
  const [role, setRole] = useState<"CONSUMER" | "DRIVER">("CONSUMER");

  // hook 상태 / 유효성 함수
  const {
    email,
    setEmail,
    emailError,
    setEmailError,
    password,
    setPassword,
    passwordError,
    passwordCheck,
    setPasswordCheck,
    passwordCheckError,
    userName,
    setUserName,
    userNameError,
    telNumber,
    telNumberError,
    setTelNumber,
    validateEmail,
    validatePassword,
    validateUserName,
    validatePasswordCheck,
    validateTelNumber,
  } = useAuthForm();

  const handleFieldBlur = (key: string) => {
    // 각 필드에 대해 해당 validate 호출
    if (key === "userName") validateUserName(userName);
    if (key === "email") validateEmail(email);
    if (key === "callNumber") validateTelNumber(telNumber);
    if (key === "pw") validatePassword(password);
    if (key === "pwCheck") validatePasswordCheck(passwordCheck);
  };

  const router = useRouter();
  const signupMutation = useSignup();

  const isFormFilled = !!(email && password && passwordCheck && userName && telNumber);
  const hasErrors = !!(
    userNameError ||
    emailError ||
    telNumberError ||
    passwordError ||
    passwordCheckError
  );
  const isSubmitDisabled = signupMutation.status === "pending" || !isFormFilled || hasErrors;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (signupMutation.status === "pending") return; // 이중 제출 방지
    // 전체 검사 실행
    validateUserName(userName);
    validateEmail(email);
    validateTelNumber(telNumber);
    validatePassword(password);
    validatePasswordCheck(passwordCheck);

    // 에러가 하나라도 있으면 제출 중단
    if (userNameError || emailError || telNumberError || passwordError || passwordCheckError) {
      return;
    }

    const payload: SignUpDTO = {
      email,
      password,
      passwordConfirm: passwordCheck,
      name: userName,
      phoneNumber: telNumber,
      role,
    };

    signupMutation.mutate(payload, {
      onSuccess: () => {
        // 자동 로그인은 아직 사용하지 않으므로 성공 시 바로 리다이렉트
        router.push("/login");
      },
      onError: (err: unknown) => {
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 409) {
            setEmailError("이미 사용중인 이메일입니다.");
            return;
          }
          console.error("회원가입 실패:", err.response?.data ?? err.message);
        } else {
          console.error("회원가입 실패:", err);
        }
      },
    });
  };

  return (
    <div className="mt-18 flex flex-col items-center gap-8">
      <Link href="/">
        <LogoText
          className={`h-auto w-48 transition-colors duration-300 ${role === "CONSUMER" ? "text-blue-500" : "text-amber-400"}`}
        />
      </Link>

      <form className="mx-auto flex w-full max-w-[640px] flex-col gap-8" onSubmit={handleSubmit}>
        <div className="mx-auto">
          <SlidToggle value={role} onChange={setRole} />
        </div>

        {fields.map((f) => (
          <label key={f.key} className="flex flex-col gap-4" onBlur={() => handleFieldBlur(f.key)}>
            <span className="text-[20px]">{f.label}</span>

            <div className="relative w-full">
              <Input
                type="basic"
                value={
                  f.key === "userName"
                    ? userName
                    : f.key === "email"
                      ? email
                      : f.key === "callNumber"
                        ? telNumber
                        : f.key === "pw"
                          ? password
                          : passwordCheck
                }
                onChange={(v: string) => {
                  if (f.key === "userName") {
                    setUserName(v);
                    validateUserName(v);
                  }
                  if (f.key === "email") {
                    setEmail(v);
                    validateEmail(v);
                  }
                  if (f.key === "callNumber") {
                    setTelNumber(v);
                    validateTelNumber(v);
                  }
                  if (f.key === "pw") {
                    setPassword(v);
                    validatePassword(v);
                  }
                  if (f.key === "pwCheck") {
                    setPasswordCheck(v);
                    validatePasswordCheck(v);
                  }
                }}
                placeholder={f.placeholder}
                inputType={f.inputType}
                error={
                  f.key === "userName"
                    ? userNameError
                    : f.key === "email"
                      ? emailError
                      : f.key === "callNumber"
                        ? telNumberError
                        : f.key === "pw"
                          ? passwordError
                          : passwordCheckError
                }
                errorPosition="right"
              />
            </div>
          </label>
        ))}
        <Button className="mt-14 mb-4" type="submit" text="시작하기" disabled={isSubmitDisabled} />
      </form>

      <div className="mx-auto flex max-w-160 flex-row justify-center">
        <span>이미 무빙 회원이신가요?</span>
        <Link href="/login" className="text-primary mb-3 ml-2">
          로그인
        </Link>
      </div>
      <div className="mx-auto flex max-w-160 flex-col items-center">
        <span className="mb-6 text-[20px]">SNS 계정으로 간편 가입하기</span>
        <div className="mb-22 flex gap-8">
          <Link href="https://google.com">
            <Image src={Google.src} alt="구글 회원가입" width={54} height={54} />
          </Link>
          <Link href="https://kakao.com">
            <Image src={Kakao.src} alt="카카오 회원가입" width={54} height={54} />
          </Link>
          <Link href="https://naver.com">
            <Image src={Naver.src} alt="네이버 회원가입" width={54} height={54} />
          </Link>
        </div>
      </div>
    </div>
  );
}
