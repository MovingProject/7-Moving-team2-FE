"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import LogoText from "@/components/ui/LogoText";
import { useState, useEffect, useRef, ChangeEvent } from "react";
import Loading from "../loading";
import Link from "next/link";
import RoleToggle from "@/components/ui/SlidToggle";

export default function Signup() {
  const fields = [
    { key: "userName", label: "이름", placeholder: "성함을 입력해 주세요" },
    { key: "email", label: "이메일", placeholder: "이메일을 입력해 주세요", inputType: "email" }, // 변경
    {
      key: "callNumber",
      label: "전화번호",
      placeholder: "전화번호를 입력해 주세요",
      inputType: "tel",
    }, // 변경
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

  const [values, setValues] = useState<Record<string, string>>({
    userName: "",
    email: "",
    callNumber: "",
    pw: "",
    pwCheck: "",
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [role, setRole] = useState<"user" | "pro">("user");

  const wrappersRef = useRef<Record<string, HTMLDivElement | null>>({});

  const handleFieldBlur = (key: string) => {
    setTouched((p) => ({ ...p, [key]: true }));
  };

  useEffect(() => {
    fields.forEach(({ key }) => {
      const wrapper = wrappersRef.current[key];
      if (!wrapper) return;

      const innerBox = wrapper.querySelector("div");
      const target = innerBox ?? wrapper;

      const shouldError = !!touched[key] && !values[key];
      if (shouldError) {
        if (!target.classList.contains("border")) target.classList.add("border");
        target.classList.add("border-red-500");

        if (!target.classList.contains("rounded-2xl")) target.classList.add("rounded-2xl");
        target.style.boxShadow = "0 0 0 1px rgba(239,68,68,0.08)";
      } else {
        target.classList.remove("border-red-500");
        target.style.boxShadow = "";
      }
    });
  }, [values, touched]);

  // 추가: key에 따라 onChange를 통합 처리
  const handleInputChange = (key: string, e: ChangeEvent<HTMLInputElement> | string) => {
    const value = typeof e === "string" ? e : e.target.value;
    setValues((p) => ({ ...p, [key]: value }));
  };

  return (
    <div className="mt-18 flex flex-col items-center gap-8">
      <LogoText
        className={`h-auto w-48 transition-colors duration-300 ${
          role === "user" ? "text-blue-500" : "text-amber-400" // 기사님 색상만 바꿔주면 됨
        }`}
      />

      <form className="mx-auto flex w-full max-w-[640px] flex-col gap-8">
        <div className="mx-auto">
          <RoleToggle value={role} onChange={setRole} />
        </div>

        {fields.map((f) => (
          <label key={f.key} className="flex flex-col gap-4" onBlur={() => handleFieldBlur(f.key)}>
            <span className="text-[20px]">{f.label}</span>

            <div
              ref={(el) => {
                wrappersRef.current[f.key] = el;
              }}
              className="relative w-full"
            >
              <Input
                type="basic"
                value={values[f.key] ?? ""}
                onChange={(v) => handleInputChange(f.key, v)} // Input은 문자열을 넘기므로 v로 받음
                placeholder={f.placeholder}
                inputType={f.inputType} // ← 여기 추가
                error={touched[f.key] && !values[f.key] ? `${f.label}을(를) 입력해 주세요` : ""}
                errorPosition="right"
              />
            </div>
          </label>
        ))}
        <Button className="mt-14 mb-6" type="submit" text="시작하기" disabled />
      </form>
      <div className="mx-auto flex max-w-160 flex-row justify-center">
        <span>이미 무빙 회원이신가요?</span>
        <Link href="/login" className="text-primary mb-18 ml-2">
          로그인
        </Link>
      </div>
      <div className="mx-auto flex max-w-160 flex-col items-center">
        <span className="mb-8">SNS 계정으로 간편 가입하기</span>
        <span className="mb-22">구글 카카오 네이버</span>
      </div>
    </div>
  );
}
