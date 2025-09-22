import Logo from "../../../../public/icon/Logo.svg";
import Menu from "@/assets/icon/menu.svg";
import { useState } from "react";
import XIcon from "@/assets/icon/X.svg";
import UserIcon from "@/assets/icon/user.svg";
import AlramIcon from "@/assets/icon/alram.svg";
import LogoMobile from "@/assets/icon/Logo-1.svg";

interface NavProps {
  option?: string;
}

export default function Nav({ option }: NavProps) {
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const optionFont =
    "text-[#1F1F1F] font-[Pretendard] text-base font-medium leading-[26px] cursor-pointer";

  return (
    <>
      <div className="flex items-center justify-between border-b border-gray-300 pb-5">
        <div className="flex">
          {!isLoggedIn ? (
            <img className="cursor-pointer" src={Logo.src} width={100} alt="logo" />
          ) : (
            <>
              <img
                className="block cursor-pointer md:hidden"
                src={LogoMobile.src}
                width={32}
                alt="logo"
              />
              <img
                className="hidden cursor-pointer md:block"
                src={Logo.src}
                width={100}
                alt="logo"
              />
            </>
          )}
          <div className="ml-8 hidden items-center gap-8 space-x-4 md:flex">
            {isLoggedIn && <p className={optionFont}>견적 요청</p>}
            <p className={optionFont}>기사님 찾기</p>
            {isLoggedIn && <p className={optionFont}>내 견적 관리</p>}
          </div>
        </div>
        <div className="flex gap-8">
          {!isLoggedIn ? (
            <button
              className="hidden cursor-pointer rounded rounded-[16px] bg-blue-500 px-5.5 py-2 text-white md:block"
              onClick={() => setIsLoggedIn(true)}
            >
              로그인
            </button>
          ) : (
            <div className="flex items-center gap-8 space-x-2">
              <img src={AlramIcon.src} alt="알람" className="h-6 w-6 cursor-pointer" />
              <div className="flex cursor-pointer">
                <img src={UserIcon.src} alt="유저" className="h-6 w-6" />
                <p>이름</p>
              </div>
            </div>
          )}
          <img
            className="h-8 w-8 cursor-pointer md:hidden"
            src={Menu.src}
            alt="Menu"
            onClick={() => setOpen((prev) => !prev)}
          />
        </div>
      </div>
      {open && (
        <div
          className={`fixed top-0 right-0 z-50 h-full w-64 transform bg-white shadow-lg transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="flex flex-col items-end space-y-4 border-b border-gray-300 p-4">
            <img
              className="cursor-pointer"
              src={XIcon.src}
              alt="취소"
              onClick={() => setOpen(false)}
            />
          </div>
          <div className="flex flex-col gap-6 p-4">
            <p className={optionFont}>기사님 찾기</p>
            <p className={optionFont} onClick={() => setIsLoggedIn((prev) => !prev)}>
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
