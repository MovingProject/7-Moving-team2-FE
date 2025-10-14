"use client";
import Logo from "../../../../public/icon/Logo.svg";
import Menu from "@/assets/icon/menu.svg";
import { useState, useEffect } from "react";
import XIcon from "@/assets/icon/X.svg";
import UserIcon from "@/assets/icon/user.svg";
import AlarmIcon from "@/assets/icon/alarm.svg";
import LogoMobile from "@/assets/icon/Logo-1.svg";
import { useAuthStore } from "@/store/authStore";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface NavProps {
  option?: string;
}

export default function Nav({ option }: NavProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const user = useAuthStore((s) => s.user); // zustand에서 유저 가져오기
  const clearUser = useAuthStore((s) => s.clearUser);
  const profileUser = useUserStore((s) => s.user);
  const clearProfileUser = useUserStore((s) => s.clearUser);
  const isLoggedIn = !!user;

  const displayName = profileUser?.name ?? user?.name ?? "임시유저";

  const optionFont =
    "text-[#1F1F1F] font-[Pretendard] text-base font-medium leading-[26px] cursor-pointer";

  const handleLogout = async () => {
    try {
      // 실제 로그아웃 API 호출
      await fetch("/api/auth/signout", {
        method: "POST",
        credentials: "include",
      });
    } catch (e) {
      console.error("로그아웃 실패:", e);
    } finally {
      clearUser(); // zustand 상태 초기화
      router.push("/login");
    }
  };

  // 프로필 정보가 갱신되면 자동으로 Nav도 반영됨
  useEffect(() => {
    // Nav가 zustand의 userStore 구독 중이므로
    // 별도의 수동 갱신은 필요 없음 (단, mount 시 강제 렌더 트리거용)
  }, [profileUser, user]);

  return (
    <>
      <div className="flex items-center justify-between border-b border-gray-300 pb-5">
        <div className="flex pt-5 pl-5">
          {!isLoggedIn ? (
            <Image
              className="cursor-pointer"
              src={Logo.src}
              width={100}
              height={100}
              alt="logo"
              onClick={() => router.push("/landing")}
            />
          ) : (
            <>
              <Image
                className="block cursor-pointer md:hidden"
                src={LogoMobile.src}
                width={32}
                height={32}
                alt="logo"
              />
              <Image
                className="hidden cursor-pointer md:block"
                src={Logo.src}
                width={100}
                height={100}
                alt="logo"
              />
            </>
          )}
          <div className="ml-8 hidden items-center gap-8 space-x-4 md:flex">
            {isLoggedIn && <p className={optionFont}>견적 요청</p>}
            <p className={optionFont}>기사님 찾기</p>
            {isLoggedIn && <p className={optionFont}>내 견적 관리</p>}
            <p
              className={optionFont}
              onClick={() => {
                if (isLoggedIn) handleLogout();
                else router.push("/login");
              }}
            >
              {isLoggedIn ? "로그아웃" : "로그인"}
            </p>
          </div>
        </div>
        <div className="flex gap-8 pt-5 pr-5">
          {!isLoggedIn ? (
            <button
              className="hidden cursor-pointer rounded-[16px] bg-blue-500 px-5.5 py-2 text-white md:block"
              onClick={() => router.push("/login")}
            >
              로그인
            </button>
          ) : (
            <div className="flex items-center gap-8 space-x-2">
              <Image
                src={AlarmIcon}
                alt="알람"
                className="h-6 w-6 cursor-pointer"
                width={100}
                height={100}
              />
              <div className="flex cursor-pointer">
                <Image src={UserIcon} alt="유저" className="h-6 w-6" width={100} height={100} />
                <p>{displayName}</p>
              </div>
            </div>
          )}
          <Image
            className="h-8 w-8 cursor-pointer md:hidden"
            src={Menu}
            alt="Menu"
            onClick={() => setOpen((prev) => !prev)}
            width={100}
            height={100}
          />
        </div>
      </div>
      {open && (
        <div
          className={`fixed top-0 right-0 z-50 h-full w-64 transform bg-white shadow-lg transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="flex flex-col items-end space-y-4 border-b border-gray-300 p-4">
            <Image
              className="cursor-pointer"
              src={XIcon}
              alt="취소"
              onClick={() => setOpen(false)}
              width={100}
              height={100}
            />
          </div>
          <div className="flex flex-col gap-6 p-4">
            <p className={optionFont}>기사님 찾기</p>
            <p
              className={optionFont}
              onClick={() => {
                if (isLoggedIn) handleLogout();
                else router.push("/login");
              }}
            >
              {isLoggedIn ? "로그아웃" : "로그인"}
            </p>
            {isLoggedIn && <p className={optionFont}>견적 요청</p>}
            {isLoggedIn && <p className={optionFont}>내 견적 관리</p>}
          </div>
        </div>
      )}
    </>
  );
}
