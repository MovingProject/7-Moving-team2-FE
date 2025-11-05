import Google from "@/assets/icon/google.svg";
import Image from "next/image";

interface SocialLoginProps {
  role?: "CONSUMER" | "DRIVER";
}

export default function SocialLogin({ role = "CONSUMER" }: SocialLoginProps) {
  const pretendardXs = "text-[#6B6B6B] font-pretendard text-[16px] font-normal leading-[18px]";
  const handleGoogleLogin = () => {
    const apiBase = process.env.NEXT_PUBLIC_API_URL;
    window.location.href = `${apiBase}/auth/google?role=${role}`;
  };
  return (
    <div className="flex flex-row items-center gap-5">
      <button
        onClick={handleGoogleLogin}
        className="cursor-pointer transition-transform hover:scale-110"
        aria-label="Google로 로그인"
      >
        <Image src={Google.src} alt="Google 로그인" width={54} height={54} />
      </button>
      <p className={pretendardXs}>구글 계정으로 간편 가입하기</p>
    </div>
  );
}
