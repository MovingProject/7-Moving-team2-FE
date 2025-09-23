import LogoText from "@/assets/icon/Logo-2.svg";
export default function Login() {
  return (
    <div>
      <div>
        <img src={LogoText.src}></img>
        <p>
          기사님이신가요? <a>기사님 전용페이지</a>
        </p>
      </div>
      <div>로그인폼</div>
      <p>
        아직 무빙 회원이 아니신가요? <a>이메일로 회원가입하기</a>
      </p>
      <div>소셜로그인</div>
    </div>
  );
}
