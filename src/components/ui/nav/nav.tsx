"use client";
import Logo from "../../../../public/icon/Logo.svg";
import Menu from "@/assets/icon/menu.svg";
import { useState, useEffect, useRef } from "react";
import XIcon from "@/assets/icon/X.svg";
import UserIcon from "@/assets/icon/user.svg";
import AlarmIcon from "@/assets/icon/alarm.svg";
import LogoMobile from "@/assets/icon/Logo-1.svg";
import Dropdown from "../Filters/Dropdown";
import { useAuthStore } from "@/store/authStore";
import { useUserStore } from "@/store/userStore";
import { useRouter, usePathname } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { getWeather } from "@/utils/hook/landing/landing";
import WeeklyForecastPanel from "../WeeklyForecastPanel";
import { useProfileQuery } from "@/hooks/useProfileQuery";
import { useNotifications } from "@/utils/hook/notification/useNotifications";
import { NotificationItem } from "@/lib/apis/notification";

interface NavProps {
  option?: string;
}

export default function Nav({ option }: NavProps) {
  const [open, setOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const notiRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const clearUser = useAuthStore((s) => s.clearUser);
  const profileUser = useUserStore((s) => s.user);
  const clearProfileUser = useUserStore((s) => s.clearUser);
  const queryClient = useQueryClient();
  const { user: loadedProfile } = useProfileQuery({
    enabled: !!user && !profileUser,
  });
  const isLoggedIn = !!user;
  const role = user?.role;
  const displayName = user?.name ?? profileUser?.name ?? "임시유저";
  const profileImage = profileUser?.profile?.image || loadedProfile?.profile?.image || null;
  const [weatherData, setWeatherData] = useState<{
    location: string;
    temp: number;
    condition: string;
    icon: string;
  } | null>(null);
  const [city, setCity] = useState("Seoul");
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [isWeeklyOpen, setIsWeeklyOpen] = useState(false);
  const optionFont =
    "text-[#1F1F1F] font-[Pretendard] text-sm lg:text-base font-medium leading-[26px] cursor-pointer";
  const cityDropdownRef = useRef<HTMLDivElement>(null);
  const weeklyPanelRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, isError } = useNotifications({
    enabled: isLoggedIn,
  });
  const notifications: NotificationItem[] = data?.pages.flatMap((page) => page.items) ?? [];
  const notificationMessages = notifications.map((n) => n.message ?? "새 알림이 있습니다.");

  const cityMap: { [key: string]: string } = {
    Seoul: "서울",
    Busan: "부산",
    Incheon: "인천",
    Daegu: "대구",
    Daejeon: "대전",
    Gwangju: "광주",
    Ulsan: "울산",
    Suwon: "수원",
    Sejong: "세종",
    Jeju: "제주",
    Chuncheon: "춘천",
  };
  const cityList = [
    "Seoul",
    "Busan",
    "Incheon",
    "Daegu",
    "Daejeon",
    "Gwangju",
    "Ulsan",
    "Suwon",
    "Sejong",
    "Jeju",
    "Chuncheon",
  ];

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/signout", {
        method: "POST",
        credentials: "include",
      });
    } catch (e) {
      console.error("로그아웃 실패:", e);
    } finally {
      clearUser();
      clearProfileUser();
      queryClient.clear();
      router.push("/login");
    }
  };

  const toggleProfileMenu = () => setIsProfileMenuOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
      if (notiRef.current && !notiRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(event.target as Node)) {
        setIsCityDropdownOpen(false);
      }
      if (weeklyPanelRef.current && !weeklyPanelRef.current.contains(event.target as Node)) {
        setIsWeeklyOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setOpen(false);
    setIsCityDropdownOpen(false);
    setIsWeeklyOpen(false);
    setIsProfileMenuOpen(false);
    setIsNotificationOpen(false);
  }, [pathname]);

  useEffect(() => {
    (async () => {
      try {
        const data = await getWeather(city); // 기본: 서울
        if (data) {
          setWeatherData({
            location: data.location,
            temp: data.temp,
            condition: data.condition,
            icon: data.icon,
          });
        }
      } catch (err) {
        console.error("날씨 데이터를 불러오지 못했습니다:", err);
      }
    })();
  }, [city]);

  /** 역할별 메뉴 렌더링 */
  const renderMenuItems = () => {
    if (!isLoggedIn) {
      return (
        <Link href={"/driverList"} className={optionFont}>
          기사님 찾기
        </Link>
      );
    }

    if (role === "CONSUMER") {
      return (
        <>
          <Link href={"/request/write"} className={optionFont}>
            견적 요청
          </Link>
          <Link href={"/driverList"} className={optionFont}>
            기사님 찾기
          </Link>
          <Link href={"/chat"} className={optionFont}>
            내 채팅
          </Link>
          <Link href={"/quotation/received"} className={optionFont}>
            내 견적 관리
          </Link>
        </>
      );
    }

    if (role === "DRIVER") {
      return (
        <>
          <Link href={"/request"} className={optionFont}>
            받은 요청
          </Link>
          <Link href={"/chat"} className={optionFont}>
            내 채팅
          </Link>
          <Link href={"/quotation/sent"} className={optionFont}>
            내 견적 관리
          </Link>
        </>
      );
    }
  };

  return (
    <>
      <div className="relative flex items-center justify-between border-b border-gray-300 pb-5">
        <div className="flex pt-5 pl-5">
          <Image
            className="hidden cursor-pointer md:block"
            src={Logo.src}
            width={100}
            height={100}
            alt="logo"
            onClick={() => router.push("/landing")}
          />
          <Image
            className="block cursor-pointer md:hidden"
            src={LogoMobile.src}
            width={32}
            height={32}
            alt="logo"
            onClick={() => router.push("/landing")}
          />
          {/* PC 메뉴 */}
          <div className="ml-8 hidden items-center gap-4 space-x-4 md:flex lg:gap-8">
            {renderMenuItems()}
          </div>
        </div>

        <div className="flex items-center gap-1 pt-5 pr-5 lg:gap-4">
          <div ref={weeklyPanelRef}>
            <p
              className="hover:text-primary flex cursor-pointer items-center text-sm font-semibold text-gray-700 lg:text-base"
              onClick={() => setIsWeeklyOpen((prev) => !prev)}
            >
              주간날씨
            </p>

            {isWeeklyOpen && (
              <div className="absolute top-full left-0 z-40 w-full border-t border-gray-200 bg-white shadow-md">
                <WeeklyForecastPanel city={city} />
              </div>
            )}
          </div>
          <div className="relative mr-4" ref={cityDropdownRef}>
            {weatherData && (
              <div
                className="flex cursor-pointer items-center gap-1 text-sm text-gray-700"
                onClick={() => setIsCityDropdownOpen((prev) => !prev)}
              >
                <img
                  src={`https:${weatherData.icon}`}
                  alt={weatherData.condition}
                  width={28}
                  height={28}
                />
                <div>
                  <p className="font-medium">{cityMap[city] || weatherData.location}</p>
                  <p className="hidden text-xs lg:block">
                    {weatherData.temp}°C · {weatherData.condition}
                  </p>
                </div>
              </div>
            )}

            {isCityDropdownOpen && (
              <div className="absolute left-1/2 z-99 mt-2 w-25 -translate-x-1/2 rounded-lg border border-gray-200 bg-white shadow-lg">
                {cityList.map((cityName) => (
                  <div
                    key={cityName}
                    className={`flex cursor-pointer items-center justify-center px-4 py-2 text-base hover:bg-gray-100 ${
                      cityName === city ? "text-primary font-semibold" : ""
                    }`}
                    onClick={() => {
                      setCity(cityName);
                      setIsCityDropdownOpen(false);
                    }}
                  >
                    {cityMap[cityName]}
                  </div>
                ))}
              </div>
            )}
          </div>
          {!isLoggedIn ? (
            <button
              className="bg-primary hidden cursor-pointer rounded-[16px] px-5.5 py-2 text-white md:block"
              onClick={() => router.push("/login")}
            >
              로그인
            </button>
          ) : (
            <div className="flex items-center gap-3 space-x-2 lg:gap-8">
              <div className="relative" ref={notiRef}>
                <Image
                  src={AlarmIcon}
                  alt="알림"
                  className="h-6 w-6 cursor-pointer"
                  width={100}
                  height={100}
                  onClick={() => setIsNotificationOpen((prev) => !prev)}
                />
                {notifications.some((n) => !n.isRead) && (
                  <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-red-500"></span>
                )}

                {isNotificationOpen && (
                  <Dropdown
                    type="notification"
                    layout="default"
                    scroll="scrollable"
                    position="right"
                    options={
                      isLoading
                        ? ["불러오는 중..."]
                        : isError
                          ? ["알림을 불러오지 못했습니다."]
                          : notificationMessages.length > 0
                            ? notificationMessages
                            : ["새 알림이 없습니다."]
                    }
                    onSelect={(opt) => {
                      console.log("알림 클릭:", opt);
                      setIsNotificationOpen(false);
                    }}
                    header={<p className="font-semibold text-gray-800">알림</p>}
                  />
                )}
              </div>
              <div className="relative flex" ref={menuRef}>
                <div className="flex cursor-pointer gap-2" onClick={toggleProfileMenu}>
                  <div className="relative h-6 w-6 overflow-hidden rounded-full border-1">
                    <Image
                      src={profileImage || UserIcon}
                      alt="유저"
                      fill
                      sizes="24px"
                      className="object-cover"
                    />
                  </div>
                  <p className="hidden lg:flex">{displayName}</p>
                </div>
                {isProfileMenuOpen && (
                  <div className="absolute top-8 right-0 z-50 flex w-[152px] flex-col gap-2 overflow-hidden rounded-xl border border-gray-100 bg-white px-1.5 py-4 shadow-md lg:w-[248px]">
                    <p className="truncate px-2 font-semibold lg:text-lg">{displayName}님</p>
                    <div className="flex flex-col gap-0.5 text-gray-700">
                      {role === "CONSUMER" && (
                        <>
                          <Link
                            href={"/mypage/profile"}
                            className="px-2 py-2 lg:px-4"
                            onClick={() => setIsProfileMenuOpen(false)}
                          >
                            프로필 수정
                          </Link>
                          <Link
                            href={"/liked"}
                            className="px-2 py-2 lg:px-4"
                            onClick={() => setIsProfileMenuOpen(false)}
                          >
                            찜한 기사님
                          </Link>
                          <Link
                            href={"/review"}
                            className="px-2 py-2 lg:px-4"
                            onClick={() => setIsProfileMenuOpen(false)}
                          >
                            이사 리뷰
                          </Link>
                        </>
                      )}
                      {role === "DRIVER" && (
                        <>
                          <Link
                            href={"/mypage"}
                            className="px-2 py-2 lg:px-4"
                            onClick={() => setIsProfileMenuOpen(false)}
                          >
                            마이페이지
                          </Link>
                          <Link
                            href={"/mypage/profile/edit"}
                            className="px-2 py-2 lg:px-4"
                            onClick={() => setIsProfileMenuOpen(false)}
                          >
                            프로필 수정
                          </Link>
                          <Link
                            href={`/mypage/basicEdit/${user?.id ?? ""}`}
                            className="px-2 py-2 lg:px-4"
                            onClick={() => setIsProfileMenuOpen(false)}
                          >
                            기본 정보 수정
                          </Link>
                        </>
                      )}
                    </div>
                    <div
                      className="cursor-pointer border-t border-gray-200 pt-2 text-center text-gray-500"
                      onClick={() => {
                        handleLogout();
                        setIsProfileMenuOpen(false);
                      }}
                    >
                      로그아웃
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 모바일 메뉴 버튼 */}
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

      {/* 모바일 전용 메뉴 */}
      {open && (
        <div
          ref={mobileMenuRef}
          className={`fixed top-0 right-0 z-50 h-full w-64 transform bg-white shadow-lg transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="flex flex-col items-end border-b border-gray-300 p-4">
            <Image
              className="cursor-pointer"
              src={XIcon}
              alt="취소"
              onClick={() => setOpen(false)}
              width={45}
              height={45}
            />
          </div>
          <div className="flex flex-col gap-6 p-4">{renderMenuItems()}</div>
          <div className="m-4 rounded-xl border border-gray-300 p-2 text-center">
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
      )}
    </>
  );
}
