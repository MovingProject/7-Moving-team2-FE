import MovingSmall from "@/assets/img/Landing1.svg";
import MovingHome from "@/assets/img/Landing2.svg";
import MovingBusiness from "@/assets/img/Landing3.svg";
import Button from "@/components/ui/Button";
import aaa from "@/assets/img/Landing_md_01.svg";
import bbb from "@/assets/img/Landing_md_02.svg";
import ccc from "@/assets/img/Landing_md_03.svg";

export default function Landing() {
  return (
    <div className="h-full bg-[#F4F7FB] lg:h-full">
      <div className="flex flex-col items-center lg:h-screen lg:justify-between">
        <p className="pt-32 pb-8 text-center font-[Pretendard] text-[24px] leading-[50px] font-semibold text-black lg:text-[36px]">
          원하는 이사 서비스를 요청하고 <br />
          견적을 받아보세요.
        </p>
        <div className="flex flex-col lg:h-[600px] lg:flex-row lg:items-stretch lg:gap-0">
          <img src={MovingSmall.src} className="lg:hidden" />
          <img
            src={aaa.src}
            className="hidden lg:block lg:h-[508px] lg:w-[432px] lg:object-contain"
          />

          <div className="flex flex-col lg:h-[508px] lg:w-[604px] lg:gap-0">
            <img src={MovingHome.src} className="lg:hidden" />
            <img
              src={bbb.src}
              className="hidden lg:block lg:h-[287px] lg:w-[764px] lg:object-contain"
            />

            <img src={MovingBusiness.src} className="lg:hidden" />
            <img
              src={ccc.src}
              className="hidden lg:block lg:h-[287px] lg:w-[764px] lg:object-contain"
            />
          </div>
        </div>

        <div className="mt-8 flex w-full flex-col items-center gap-4 pb-10 lg:flex-row lg:justify-center lg:gap-6">
          <Button className="w-[320px]" radius="full">
            로그인
          </Button>
          <Button className="w-[320px]" variant="secondary" radius="full">
            회원가입
          </Button>
        </div>
      </div>
    </div>
  );
}
