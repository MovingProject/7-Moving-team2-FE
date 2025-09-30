"use client";

import Header from "./components/Header";
import InputArea from "./components/InputArea";
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function BasicEditPage() {
  const router = useRouter();

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
    // TODO: API 연동
  };

  return (
    <main className="px-[24px] py-10 md:px-[200px] lg:px-[100px] xl:px-[260px]">
      <Header />
      <section className="w-full py-3">
        <div className="border-t border-gray-200" />
      </section>
      {/* Input Section */}
      <section className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-6 lg:divide-y-0">
        {/* 왼쪽 */}
        <div className="flex flex-col divide-y divide-gray-200">
          <InputArea
            label="이름"
            value={name}
            onChange={setName}
            className="!max-w-full border-0 bg-gray-100"
          />
          <InputArea
            label="이메일"
            value={email}
            onChange={() => {}}
            className="pointer-events-none !max-w-full border-0 bg-gray-100 text-gray-400"
          />
          <InputArea
            label="전화번호"
            value={phone}
            onChange={setPhone}
            className="!max-w-full border-0 bg-gray-100"
          />
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
            className="!max-w-full border-0 bg-gray-100"
          />
          <InputArea
            label="새 비밀번호"
            type="basic"
            inputType="password"
            value={newPw}
            onChange={setNewPw}
            placeholder="새 비밀번호를 입력해주세요"
            className="!max-w-full border-0 bg-gray-100"
          />
          <InputArea
            label="새 비밀번호 확인"
            type="basic"
            inputType="password"
            value={confirmPw}
            onChange={setConfirmPw}
            placeholder="새 비밀번호를 다시 입력해주세요"
            className="!max-w-full border-0 bg-gray-100"
          />
        </div>
      </section>

      {/* Button Section */}
      <section className="mt-10 flex flex-col gap-6 lg:flex-row lg:items-center">
        <Button
          text="취소"
          variant="secondary"
          size="md"
          radius="default"
          className="w-full md:w-auto lg:!max-w-full lg:flex-1"
          onClick={handleCancel}
        />
        <Button
          text="수정하기"
          variant="primary"
          size="md"
          radius="default"
          className="w-full md:w-auto lg:!max-w-full lg:flex-1"
          onClick={handleSubmit}
        />
      </section>
    </main>
  );
}
