import Input from "@/components/ui/Input";
import { useState } from "react";
import Button from "@/components/ui/Button";
export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //TODO : FIX : INPUT에서 바꿔야할거생김 <input tpye:{} /> 이부분 조절할수있도록해야됨.
  return (
    <div>
      <form className="flex w-[480px] flex-col gap-3.5">
        <label>이메일</label>
        <Input
          type="basic"
          size="full"
          errorPosition="right"
          error="잘못된 이메일 형식입니다."
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        ></Input>
        <label className="mt-[8px]">비밀번호</label>
        <Input
          type="basic"
          size="full"
          errorPosition="right"
          error="잘못된 비밀번호입니다."
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        ></Input>
        <div className="m-4" />
        <Button>로그인</Button>
      </form>
    </div>
  );
}
