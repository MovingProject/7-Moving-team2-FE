"use client";
import LoginForm from "@/app/login/components/LoginForm";
import SocialLogin from "./components/SocialLogin";
import SwitchButton from "./components/SwitchButton";
import LogoText from "@/assets/icon/Logo-2.svg";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

// type UserResponse = {
//   success: boolean;
//   data: {
//     id: string;
//     email: string;
//     name: string;
//     role: "DRIVER" | "CONSUMER";
//     createdAt: string;
//     isProfileRegistered: boolean;
//   };
// };

export default function Login() {
  const [role, setRole] = useState<"CONSUMER" | "DRIVER">("CONSUMER");
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (user) {
      router.replace("/landing");
    }
  }, [user, router]);

  return (
    <div className="mt-10 flex justify-center">
      <div className="flex w-full max-w-[480px] flex-col items-center">
        <div className="mb-[40px] flex flex-col items-center">
          <Image className="mb-[24px]" src={LogoText} alt="" width={100} height={100}></Image>
          <SwitchButton selected={role} setSelected={setRole} />
        </div>
        <LoginForm role={role} />
        <p className="font-pretendard mt-[24px] text-[16px] leading-[18px] font-normal text-[#6B6B6B]">
          아직 무빙 회원이 아니신가요?{" "}
          <a className="font-pretendard text-[16px] leading-[20px] font-semibold text-[var(--Primary-blue-300,#1B92FF)] underline">
            이메일로 회원가입하기
          </a>
        </p>
        <SocialLogin />
      </div>
    </div>
  );
}
