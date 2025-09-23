import Naver from "@/assets/icon/naver.svg";
import Kakao from "@/assets/icon/kakao.svg";
import Google from "@/assets/icon/google.svg";

export default function SocialLogin() {
  return (
    <div className="mt-[40px] flex flex-col items-center">
      <p>SNS 계정으로 간편 가입하기</p>
      <div className="mt-[24px] flex gap-5">
        <img src={Google.src} alt="소셜로그인" />
        <img src={Kakao.src} alt="소셜로그인" />
        <img src={Naver.src} alt="소셜로그인" />
      </div>
    </div>
  );
}
