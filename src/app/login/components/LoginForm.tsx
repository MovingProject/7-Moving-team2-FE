import Input from "@/components/ui/Input";
import { useState } from "react";
import Button from "@/components/ui/Button";
export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");

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
        ></Input>
        <div className="m-4" />
        <Button>로그인</Button>
      </form>
    </div>
  );
}
