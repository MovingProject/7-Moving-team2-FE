"use client";
import MovingSmall from "@/assets/img/Landing1.svg";
import MovingHome from "@/assets/img/Landing2.svg";
import MovingBusiness from "@/assets/img/Landing3.svg";
import Button from "@/components/ui/Button";
import MovingSmallMd from "@/assets/img/Landing_md_01.svg";
import MovingHomeMd from "@/assets/img/Landing_md_02.svg";
import MovingBusinessMd from "@/assets/img/Landing_md_03.svg";
import Image from "next/image";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

export default function Landing() {
  const user = useAuthStore((s) => s.user);
  const isLoggedIn = !!user;
  const router = useRouter();

  console.log("user", user, "succ", isLoggedIn);

  return (
    <div className="min-h-screen bg-[#F4F7FB] outline-none">
      <div className="flex min-h-screen flex-col items-center justify-between caret-transparent outline-none focus:ring-0">
        <p className="pt-16 pb-6 text-center font-[Pretendard] text-[24px] leading-[32px] font-semibold text-black outline-none md:pb-8 lg:pt-20 lg:text-[36px] lg:leading-[50px]">
          원하는 이사 서비스를 요청하고 <br />
          견적을 받아보세요.
        </p>

        {/* 모바일 레이아웃 */}
        <div className="flex w-full flex-col items-center gap-4 px-4 md:hidden">
          <Image
            src={MovingSmall.src}
            className="w-full max-w-[360px]"
            alt="소형이사"
            width={360}
            height={200}
          />
          <Image
            src={MovingHome.src}
            className="w-full max-w-[360px]"
            alt="가정이사"
            width={360}
            height={200}
          />
          <Image
            src={MovingBusiness.src}
            className="w-full max-w-[360px]"
            alt="기업, 사무실 이사"
            width={360}
            height={200}
          />
        </div>

        {/* 태블릿 레이아웃 */}
        <div className="hidden w-full flex-col items-center gap-4 px-6 md:flex lg:hidden">
          <Image
            src={MovingSmall.src}
            className="w-full max-w-[600px]"
            alt="소형이사"
            width={600}
            height={300}
          />
          <Image
            src={MovingHome.src}
            className="w-full max-w-[600px]"
            alt="가정이사"
            width={600}
            height={300}
          />
          <Image
            src={MovingBusiness.src}
            className="w-full max-w-[600px]"
            alt="기업, 사무실 이사"
            width={600}
            height={300}
          />
        </div>

        {/* 데스크톱 레이아웃 */}
        <div className="hidden lg:flex lg:items-start lg:justify-center lg:gap-6">
          <div className="min-w-0 flex-1">
            <Image
              src={MovingSmallMd.src}
              alt="소형이사"
              width={432}
              height={508}
              className="h-auto w-full object-contain"
            />
          </div>
          <div className="flex min-w-0 flex-[1.5] flex-col gap-6">
            <Image
              src={MovingHomeMd.src}
              alt="가정이사"
              width={764}
              height={241}
              className="h-auto w-full object-contain"
            />
            <Image
              src={MovingBusinessMd.src}
              alt="기업, 사무실 이사"
              width={764}
              height={241}
              className="h-auto w-full object-contain"
            />
          </div>
        </div>

        <div className="mt-8 flex w-full flex-col items-center gap-4 px-4 pb-10 md:flex-row md:justify-center md:gap-6">
          {!isLoggedIn && (
            <>
              <Button
                className="w-full max-w-[320px]"
                radius="full"
                onClick={() => router.push("/login")}
              >
                로그인
              </Button>
              <Button
                className="w-full max-w-[320px]"
                variant="secondary"
                radius="full"
                onClick={() => router.push("/signUp")}
              >
                회원가입
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
