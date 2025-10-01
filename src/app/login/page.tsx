"use client";
import LoginForm from "@/app/login/components/LoginForm";
import SocialLogin from "./components/SocialLogin";
import SwitchButton from "./components/SwitchButton";
import LogoText from "@/assets/icon/Logo-2.svg";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";

type UserResponse = {
  success: boolean;
  data: {
    id: string;
    email: string;
    name: string;
    role: "DRIVER" | "CONSUMER";
    createdAt: string;
    isProfileRegistered: boolean;
  };
};

export default function Login() {
  const pretendardXs = "text-[#6B6B6B] font-pretendard text-[16px] font-normal leading-[18px]";
  const pretendardXsUnderline =
    "text-[var(--Primary-blue-300,#1B92FF)] font-pretendard text-[16px] font-semibold leading-[20px] underline";

  const [role, setRole] = useState<"CONSUMER" | "DRIVER">("CONSUMER");

  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: user } = useQuery<UserResponse | null, Error>({
    queryKey: ["user"],
    queryFn: () => queryClient.getQueryData<UserResponse>(["user"]) ?? null,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (user?.success) {
      router.replace("/landing");
    }
  }, [user, router]);

  return (
    <div className="mt-10 flex justify-center">
      <div className="flex w-full max-w-[480px] flex-col items-center">
        <div className="mb-[40px] flex flex-col items-center">
          <Image className="mb-[24px]" src={LogoText.src} alt="" width={100} height={100}></Image>
          <SwitchButton selected={role} setSelected={setRole} />
        </div>
        <LoginForm role={role}></LoginForm>
        <p className={`mt-[24px] ${pretendardXs}`}>
          아직 무빙 회원이 아니신가요?{" "}
          <a className={pretendardXsUnderline} href="/signUp">
            이메일로 회원가입하기
          </a>
        </p>
        <SocialLogin></SocialLogin>
      </div>
    </div>
  );
}
