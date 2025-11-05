"use client";

import Link from "next/link";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import LogoText from "@/components/ui/LogoText";
import SlidToggle from "@/components/ui/SlidToggle";
import { useState, useRef } from "react";
import { useAuthForm } from "@/hooks/useAuthForm";
import React from "react";
import { useSignup, type SignUpDTO } from "@/utils/hook/signup/api";
import { useRouter } from "next/navigation";
import WelcomeOverlay from "@/components/WelcomeOverlay";
import { useLogin } from "@/utils/hook/auth/useLogin";
import axios from "axios";
import SocialLogin from "../login/components/SocialLogin";
import { useRoleStore } from "@/store/roleStore";

export default function Signup() {
  const fields = [
    { key: "userName", label: "이름", placeholder: "성함을 입력해 주세요" },
    { key: "email", label: "이메일", placeholder: "이메일을 입력해 주세요", inputType: "email" },
    {
      key: "callNumber",
      label: "전화번호",
      placeholder: "010을 제외한 전화번호를 입력해 주세요",
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
  const { role, setRole } = useRoleStore();
  const phoneRef = useRef<HTMLInputElement>(null);

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
  const loginMutation = useLogin();
  const [showOverlay, setShowOverlay] = React.useState(false);
  const [signupRole, setSignupRole] = React.useState<"CONSUMER" | "DRIVER">("CONSUMER");

  const isFormFilled = !!(email && password && passwordCheck && userName && telNumber);
  const hasErrors = !!(
    userNameError ||
    emailError ||
    telNumberError ||
    passwordError ||
    passwordCheckError
  );
  const isSubmitDisabled = signupMutation.status === "pending" || !isFormFilled || hasErrors;

  const handlePhoneChange = (v: string) => {
    let digits = v.replace(/[^0-9]/g, "");

    if (digits.length === 0) {
      setTelNumber("");
      return;
    }

    if (!digits.startsWith("010")) {
      digits = "010" + digits.replace(/^010/, "");
    }

    let formatted = digits;
    if (digits.length > 3 && digits.length <= 7) {
      formatted = digits.replace(/^(\d{3})(\d{0,4})/, "$1-$2");
    } else if (digits.length > 7) {
      formatted = digits.replace(/^(\d{3})(\d{4})(\d{0,4})/, "$1-$2-$3");
    } else if (digits.length <= 3) {
      formatted = "010-";
    }

    if (!formatted.startsWith("010-")) formatted = "010-";

    if (formatted === "010-" && v.endsWith("-") === false) {
      setTelNumber("");
      return;
    }

    setTelNumber(formatted);
    validateTelNumber(formatted);
  };

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
        // 회원가입 성공 후 오버레이 표시
        setSignupRole(role); // role 정보 저장
        setShowOverlay(true);

        // 자동 로그인 시도
        (async () => {
          try {
            await loginMutation.mutateAsync({
              email: payload.email,
              password: payload.password,
              role: payload.role,
            });
            // 로그인 성공 (오버레이는 자동으로 닫히면서 프로필 페이지로 이동)
          } catch (err) {
            console.warn("자동 로그인 실패:", err);
            // 로그인 실패해도 오버레이는 표시
          }
        })();
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
    <div className="mt-18 flex flex-col items-center gap-8 px-4 pt-6 md:px-5 lg:px-8 xl:px-60">
      <Link href="/">
        <LogoText
          className={`h-auto w-48 transition-colors duration-300 ${role === "CONSUMER" ? "text-primary" : "text-amber-400"}`}
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
                    handlePhoneChange(v);
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
        <span className="font-normal text-gray-500">이미 무빙 회원이신가요?</span>
        <Link
          href="/login"
          className="text-primary mb-3 ml-2 font-semibold underline underline-offset-2"
        >
          로그인
        </Link>
      </div>
      <div className="mb-10 flex flex-col items-center">
        <SocialLogin role={role} />
      </div>
      <WelcomeOverlay
        open={showOverlay}
        onClose={() => {
          setShowOverlay(false);
          // 오버레이 닫힐 때 프로필 등록 페이지로 이동 (role 쿼리 전달)
          router.push(`/mypage/profile?role=${signupRole}`);
        }}
      />
    </div>
  );
}
