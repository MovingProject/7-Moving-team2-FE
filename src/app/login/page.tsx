"use client";
import LoginForm from "@/app/login/components/LoginForm";
import SocialLogin from "./components/SocialLogin";
import Link from "next/link";
import SwitchButton from "./components/SwitchButton";
import LogoText from "@/assets/icon/Logo-2.svg";

export default function Login() {
  const pretendardXs = "text-[#6B6B6B] font-pretendard text-[16px] font-normal leading-[18px]";
  const pretendardXsUnderline =
    "text-[var(--Primary-blue-300,#1B92FF)] font-pretendard text-[16px] font-semibold leading-[20px] underline";

  return (
    <div className="mt-10 flex justify-center">
      <div className="flex w-full max-w-[480px] flex-col items-center">
        <div className="mb-[40px] flex flex-col items-center">
          <img className="mb-[24px]" src={LogoText.src}></img>
          <SwitchButton />
        </div>
        <LoginForm></LoginForm>
        <p className={`mt-[24px] ${pretendardXs}`}>
          아직 무빙 회원이 아니신가요?{" "}
          <a className={pretendardXsUnderline}>이메일로 회원가입하기</a>
        </p>
        <SocialLogin></SocialLogin>
      </div>
    </div>
  );
}
