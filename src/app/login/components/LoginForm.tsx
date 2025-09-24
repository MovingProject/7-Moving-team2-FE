import Input from "@/components/ui/Input";
import { useState } from "react";
import Button from "@/components/ui/Button";
import Link from "next/link";
import LogoText from "@/components/ui/LogoText";
import SlidToggle from "@/components/ui/SlidToggle";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [role, setRole] = useState<"user" | "pro">("user");

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

  //TODO : FIX : INPUT에서 바꿔야할거생김 <input tpye:{} /> 이부분 조절할수있도록해야됨.
  return (
    <div>
      <form className="flex w-[480px] flex-col gap-3.5">
        <div className="mb-[40px] flex flex-col items-center gap-8">
          <Link href="/">
            <LogoText
              className={`h-auto w-48 transition-colors duration-300 ${role === "user" ? "text-blue-500" : "text-amber-400"}`}
            />
          </Link>
          <div className="mx-auto">
            <SlidToggle value={role} onChange={setRole} />
          </div>
        </div>
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
        <Button>로그인</Button>
      </form>
    </div>
  );
}
