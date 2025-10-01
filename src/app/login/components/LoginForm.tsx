import Input from "@/components/ui/Input";
import { useState } from "react";
import Button from "@/components/ui/Button";
import { useLogin } from "@/utils/hook/auth/useLogin";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

type LoginFormProps = {
  role: "DRIVER" | "CONSUMER";
};

// type User = {
//   success: boolean;
//   data: {
//     id: string;
//     email: string;
//     name: string;
//     role: "DRIVER" | "CONSUMER";
//     createdAt: string;
//     isProfileRegistered: boolean;
//   };
// };

export default function LoginForm({ role }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  const { mutate: login, isPending } = useLogin();

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
        onSuccess: () => {
          console.log("로그인성공");
          router.push("/landing");
        },
        onError: () => {
          console.log("로그인실패");
          //TODO : 로그인실패 모달 연동
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
        <div className="m-4" />
        <Button type="submit" disabled={isPending}>
          {isPending ? "로그인 중..." : "로그인"}
        </Button>
      </form>
    </div>
  );
}
