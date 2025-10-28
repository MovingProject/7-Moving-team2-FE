import Input from "@/components/ui/Input";
import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import { useLogin } from "@/utils/hook/auth/useLogin";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { getUserProfile } from "@/utils/hook/profile/profile";

type LoginFormProps = {
  role: "DRIVER" | "CONSUMER";
};

export default function LoginForm({ role }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [remember, setRemember] = useState(false);
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  const { mutate: login, isPending } = useLogin();

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRemember(true);
    }
  }, []);

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (!value.includes("@")) {
      setError("잘못된 이메일 형식입니다.");
    } else {
      setError("");
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (value.length < 6) {
      setPasswordError("비밀번호는 6자리 이상이어야 합니다.");
    } else {
      setPasswordError("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@") || password.length < 6) return;

    login(
      { email, password, role },
      {
        onSuccess: async () => {
          console.log("로그인성공");

          if (remember) {
            localStorage.setItem("rememberEmail", email);
          } else {
            localStorage.removeItem("rememberEmail");
          }

          // 프로필 여부 확인 (기사/고객 모두)
          try {
            const profile = await getUserProfile();

            // 프로필이 없으면 프로필 등록 페이지로
            if (!profile || !profile.profile) {
              console.log("[LoginForm] 프로필 미등록 - 프로필 등록 페이지로 이동");
              router.push("/mypage/profile");
              return;
            }
          } catch (error) {
            // 프로필 조회 실패 시 (500 에러 등) 프로필 등록 페이지로
            console.log("[LoginForm] 프로필 조회 실패 - 프로필 등록 페이지로 이동");
            router.push("/mypage/profile");
            return;
          }

          // 프로필이 있으면 랜딩 페이지로
          router.push("/landing");
        },
        onError: () => {
          console.log("로그인실패");
          //TODO : 로그인실패 팝업 연동
        },
      }
    );
  };

  //TODO : FIX : INPUT에서 바꿔야할거생김 <input type:{} /> 이부분 조절할수있도록해야됨.
  return (
    <div className="w-full max-w-[640px]">
      <form className="flex w-full max-w-[640px] flex-col gap-3.5" onSubmit={handleSubmit}>
        <label>이메일</label>
        <Input
          type="basic"
          size="full"
          errorPosition="right"
          error={error}
          onChange={handleEmailChange}
          value={email}
        ></Input>
        <label className="mt-[8px]">비밀번호</label>
        <Input
          type="basic"
          size="full"
          errorPosition="right"
          error={passwordError}
          onChange={handlePasswordChange}
          value={password}
          inputType="password"
        ></Input>
        <label className="mt-3 flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />
          로그인 정보 기억하기
        </label>
        <div className="m-4" />
        <Button type="submit" disabled={isPending}>
          {isPending ? "로그인 중..." : "로그인"}
        </Button>
      </form>
    </div>
  );
}
