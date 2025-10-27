"use client";

import Header from "./components/Header";
import InputArea from "./components/InputArea";
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { updateBasicInfo } from "@/utils/hook/profile/profile";
import { useUserStore } from "@/store/userStore";
import { UpdateBasicInfoRequest } from "@/types/card";
import { useProfileQuery } from "@/hooks/useProfileQuery";
import { useAuthStore } from "@/store/authStore";

export default function BasicEditPage() {
  const router = useRouter();
  const { setUser } = useUserStore();
  const { user, isLoading, error } = useProfileQuery();
  const authUser = useAuthStore((s) => s.user);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [loading, setLoading] = useState(false);
  const hasCheckedAccess = useRef(false);
  console.log("🚩 user data 확인:", user);

  // DRIVER 계정만 접근 가능
  useEffect(() => {
    if (!hasCheckedAccess.current && authUser && authUser.role !== "DRIVER") {
      hasCheckedAccess.current = true;
      alert("기사 회원만 접근할 수 있습니다.");
      router.push("/mypage/profile");
    }
  }, [authUser, router]);

  // user fetch 이후 input 초기값 반영
  useEffect(() => {
    if (user) {
      setName(user.name ?? "");
      setEmail(user.email ?? "");
      setPhone(user.phoneNumber ?? "");
    }
  }, [user]);

  const handleCancel = () => {
    router.push("/mypage");
  };

  const handleSubmit = async () => {
    if (newPw && newPw !== confirmPw) {
      alert("새 비밀번호가 일치하지 않습니다.");
      return;
    }

    const nameChanged = name !== user?.name;
    const phoneChanged = phone !== user?.phoneNumber;

    if (!nameChanged && !phoneChanged && !currentPw && !newPw) {
      alert("변경된 내용이 없습니다.");
      return;
    }

    setLoading(true);

    try {
      const dto: UpdateBasicInfoRequest = {};
      if (nameChanged) dto.name = name;
      if (phoneChanged) dto.phoneNumber = phone;
      if (currentPw) dto.currentPassword = currentPw;
      if (newPw) dto.newPassword = newPw;

      const updatedUser = await updateBasicInfo(dto);
      setUser(updatedUser);
      alert("기본 정보가 성공적으로 수정되었습니다!");
      if (user?.role === "DRIVER") router.push("/mypage");
      else router.back();
    } catch (err) {
      console.error("[BasicEditPage] 기본 정보 수정 실패:", err);
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "수정 중 오류가 발생했습니다.";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  // 권한 체크 중
  if (!authUser) {
    return <div className="p-10 text-center">로딩 중...</div>;
  }

  // CONSUMER는 접근 불가 (리다이렉트 중)
  if (authUser.role !== "DRIVER") {
    return null;
  }

  if (isLoading) return <div className="p-10 text-center">로딩 중...</div>;
  if (error || !user)
    return <div className="p-10 text-center">프로필 정보를 불러오지 못했습니다.</div>;

  return (
    <main className="px-4 pt-6 md:px-5 lg:px-8 xl:px-60">
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
            inputType="tel"
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
          disabled={loading}
        />
      </section>
    </main>
  );
}
