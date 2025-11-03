import Naver from "@/assets/icon/naver.svg";
import Kakao from "@/assets/icon/kakao.svg";
import Google from "@/assets/icon/google.svg";
import Image from "next/image";

interface SocialLoginProps {
  role?: "CONSUMER" | "DRIVER";
}

export default function SocialLogin({ role = "CONSUMER" }: SocialLoginProps) {
  const pretendardXs = "text-[#6B6B6B] font-pretendard text-[16px] font-normal leading-[18px]";
  const handleGoogleLogin = () => {
    // 프록시를 통해 백엔드로 요청
    window.location.href = `/api/auth/google?role=${role}`;
  };
  return (
    <div className="mt-[40px] flex flex-col items-center">
      <p className={pretendardXs}>SNS 계정으로 간편 가입하기</p>
      <div className="mt-[24px] flex gap-5">
        <button
          onClick={handleGoogleLogin}
          className="cursor-pointer transition-transform hover:scale-110"
          aria-label="Google로 로그인"
        >
          <Image src={Google.src} alt="Google 로그인" width={54} height={54} />
        </button>
        <Image className="cursor-pointer" src={Kakao.src} alt="소셜로그인" width={54} height={54} />
        <Image className="cursor-pointer" src={Naver.src} alt="소셜로그인" width={54} height={54} />
      </div>
    </div>
  );
}
