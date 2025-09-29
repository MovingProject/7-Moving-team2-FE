import Naver from "@/assets/icon/naver.svg";
import Kakao from "@/assets/icon/kakao.svg";
import Google from "@/assets/icon/google.svg";
import Image from "next/image";

export default function SocialLogin() {
  const pretendardXs = "text-[#6B6B6B] font-pretendard text-[16px] font-normal leading-[18px]";
  return (
    <div className="mt-[40px] flex flex-col items-center">
      <p className={pretendardXs}>SNS 계정으로 간편 가입하기</p>
      <div className="mt-[24px] flex gap-5">
        <Image
          className="cursor-pointer"
          src={Google.src}
          alt="소셜로그인"
          width={50}
          height={50}
        />
        <Image className="cursor-pointer" src={Kakao.src} alt="소셜로그인" width={50} height={50} />
        <Image className="cursor-pointer" src={Naver.src} alt="소셜로그인" width={50} height={50} />
      </div>
    </div>
  );
}
