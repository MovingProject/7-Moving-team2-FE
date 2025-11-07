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
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function Landing() {
  const user = useAuthStore((s) => s.user);
  const isLoggedIn = !!user;
  const router = useRouter();
  const section1Ref = useRef<HTMLDivElement>(null);
  const section2Ref = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const handleScroll = (e: WheelEvent) => {
      e.preventDefault();
      if (e.deltaY > 0 && current === 0) {
        const top = (section2Ref.current?.offsetTop ?? 0) - 80;
        window.scrollTo({ top, behavior: "smooth" });
        setCurrent(1);
      } else if (e.deltaY < 0 && current === 1) {
        const top = (section1Ref.current?.offsetTop ?? 0) - 80;
        window.scrollTo({ top, behavior: "smooth" });
        setCurrent(0);
      }
    };

    window.addEventListener("wheel", handleScroll, { passive: false });
    return () => window.removeEventListener("wheel", handleScroll);
  }, [current]);

  return (
    <div className="min-h-screen bg-[#F4F7FB] outline-none">
      <div className="flex min-h-screen flex-col items-center justify-between caret-transparent outline-none focus:ring-0">
        <section
          ref={section1Ref}
          className="flex min-h-screen flex-col items-center justify-center bg-[#F4F7FB]"
        >
          <motion.p
            initial={{ opacity: 0, y: 40 }} // 처음엔 살짝 아래에서 안 보이게
            animate={{ opacity: 1, y: 0 }} // 위로 부드럽게 올라오면서 보이게
            transition={{ duration: 0.8, ease: "easeOut" }} // 속도감 자연하게
            className="pt-16 pb-6 text-center font-[Pretendard] text-[24px] leading-[32px] font-semibold text-black outline-none md:pb-8 lg:pt-20 lg:text-[36px] lg:leading-[50px]"
          >
            원하는 이사 서비스를 요청하고 <br />
            견적을 받아보세요.
          </motion.p>

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
        </section>
        <section
          ref={section2Ref}
          className="flex h-screen flex-col items-center justify-center bg-[#F4F7FB] pb-100"
        >
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="pt-16 pb-6 text-center font-[Pretendard] text-[24px] leading-[32px] font-semibold text-black md:pb-8 lg:pt-20 lg:text-[36px] lg:leading-[50px]"
          >
            이사 과정을 영상으로 <br />
            간편하게 확인해보세요.
          </motion.p>

          <div className="flex w-full justify-center px-4 md:px-0">
            <div className="relative aspect-video w-[90vw] max-w-[1400px] overflow-hidden rounded-xl shadow-lg">
              <iframe
                className="absolute top-0 left-0 h-full w-full"
                src="https://www.youtube.com/embed/DdF-u3fe5pg?mute=0&controls=1&modestbranding=1"
                title="Moving Service Intro Video"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
