"use client";
import LoginForm from "@/app/login/components/LoginForm";
import SocialLogin from "./components/SocialLogin";
import SlidToggle from "@/components/ui/SlidToggle";
import LogoText from "@/components/ui/LogoText";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useRoleStore } from "@/store/roleStore";
import Link from "next/link";

export default function Login() {
  const { role, setRole } = useRoleStore();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (user) {
      router.replace("/landing");
    }
  }, [user, router]);

  return (
    <div className="mt-10 flex justify-center px-4 md:px-5 lg:px-8 xl:px-60">
      <div className="flex w-full max-w-[480px] flex-col items-center">
        <div className="mb-[40px] flex flex-col items-center">
          <Link href={"/"}>
            <LogoText
              className={`mb-[24px] h-auto w-48 transition-colors duration-300 ${
                role === "CONSUMER" ? "text-primary" : "text-amber-400"
              }`}
            />
          </Link>
          <SlidToggle value={role} onChange={setRole} />
        </div>
        <LoginForm role={role} />
        <p className="font-pretendard mt-[24px] text-[16px] leading-[18px] font-normal text-gray-500">
          아직 무빙 회원이 아니신가요?{" "}
          <Link
            href={"/signUp"}
            className="font-pretendard text-primary text-[16px] leading-[20px] font-semibold underline"
          >
            이메일로 회원가입하기
          </Link>
        </p>
        <div className="mt-10">
          <SocialLogin role={role} />
        </div>
      </div>
    </div>
  );
}
