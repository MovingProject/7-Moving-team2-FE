"use client";

import Header from "./components/Header";
import InputArea from "./components/InputArea";
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { patchUserBasicInfo } from "@/utils/hook/profile/profile";
import { useUserStore } from "@/store/userStore";

export default function BasicEditPage() {
  const router = useRouter();
  const { user, setUser } = useUserStore();

  const [name, setName] = useState(user?.name ?? "");
  const [email] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(user?.phoneNumber ?? "");
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCancel = () => {
    router.push("/mypage"); // 변경 무시 → 기본 페이지
  };

  const handleSubmit = async () => {
    if (newPw && newPw !== confirmPw) {
      alert("새 비밀번호가 일치하지 않습니다.");
      return;
    }

    const dto = {
      name,
      phoneNumber: phone,
      currentPassword: currentPw || undefined,
      newPassword: newPw || undefined,
    };

    try {
      setLoading(true);
      const updatedUser = await patchUserBasicInfo(dto);
      setUser(updatedUser);
      alert("기본 정보가 성공적으로 수정되었습니다!");
      router.push("/mypage/profile");
    } catch (err) {
      console.error("[BasicEditPage] 기본 정보 수정 실패:", err);
      alert("수정 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
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
