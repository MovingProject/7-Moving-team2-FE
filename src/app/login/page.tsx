"use client";
import LogoText from "@/assets/icon/Logo-2.svg";
import LoginForm from "@/app/login/components/LoginForm";
import SocialLogin from "./components/SocialLogin";
import SwitchButton from "./components/SwitchButton";
export default function Login() {
  return (
    <div className="mt-10 flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="mb-[40px] flex flex-col items-center">
          <img className="mb-[24px]" src={LogoText.src}></img>
          <SwitchButton />
        </div>
        <LoginForm></LoginForm>
        <p className="mt-[24px]">
          아직 무빙 회원이 아니신가요? <a>이메일로 회원가입하기</a>
        </p>
        <SocialLogin></SocialLogin>
      </div>
    </div>
  );
}
