"use client";

import Header from "./components/Header";
import InputArea from "./components/InputArea";
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function BasicEditPage() {
  const router = useRouter();

  // 상태 관리
  const [name, setName] = useState("김코드");
  const [email] = useState("kcode@email.com"); // 수정 불가
  const [phone, setPhone] = useState("01012345678");
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");

  const handleCancel = () => {
    router.push("/mypage"); // 변경 무시 → 기본 페이지
  };

  const handleSubmit = () => {
    console.log("제출 데이터:", { name, email, phone, currentPw, newPw, confirmPw });
    // TODO: 수정하기 API 연동
  };

  return (
    <main className="px-[24px] py-10 md:px-[200px] lg:px-[260px]">
      <Header />

      {/* Input Section */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* 왼쪽 */}
        <div className="flex flex-col divide-y divide-gray-200">
          <InputArea label="이름" value={name} onChange={setName} />
          <InputArea label="이메일" value={email} onChange={() => {}} />
          <InputArea label="전화번호" value={phone} onChange={setPhone} />
        </div>

        {/* 오른쪽 */}
        <div className="flex flex-col divide-y divide-gray-200">
          <InputArea
            label="현재 비밀번호"
            type="basic"
            inputType="password"
            value={currentPw}
            onChange={setCurrentPw}
            placeholder="현재 비밀번호를 입력해주세요"
          />
          <InputArea
            label="새 비밀번호"
            type="basic"
            inputType="password"
            value={newPw}
            onChange={setNewPw}
            placeholder="새 비밀번호를 입력해주세요"
          />
          <InputArea
            label="새 비밀번호 확인"
            type="basic"
            inputType="password"
            value={confirmPw}
            onChange={setConfirmPw}
            placeholder="새 비밀번호를 다시 입력해주세요"
          />
        </div>
      </section>

      {/* Button Section */}
      <section className="mt-10 flex flex-col gap-3 lg:flex-row lg:justify-between">
        <Button
          text="취소"
          variant="secondary"
          size="md"
          radius="default"
          className="w-full md:w-auto lg:w-[510px]"
          onClick={handleCancel}
        />
        <Button
          text="수정하기"
          variant="primary"
          size="md"
          radius="default"
          className="w-full md:w-auto lg:w-[510px]"
          onClick={handleSubmit}
        />
      </section>
    </main>
  );
}
