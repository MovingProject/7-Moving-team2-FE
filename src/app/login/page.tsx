"use client";
import LoginForm from "@/app/login/components/LoginForm";
import SocialLogin from "./components/SocialLogin";
import Link from "next/link";

export default function Login() {
  return (
    <div className="mt-10 flex items-center justify-center">
      <div className="flex flex-col items-center">
        <LoginForm></LoginForm>
        <div className="mx-auto mt-6 flex max-w-160 flex-row items-center gap-2">
          <p> 아직 무빙 회원이 아니신가요? </p>
          <Link href="/signup" className="text-primary">
            이메일로 회원가입하기
          </Link>
        </div>

        <SocialLogin></SocialLogin>
      </div>
    </div>
  );
}
