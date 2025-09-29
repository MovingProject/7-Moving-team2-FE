import MovingSmall from "@/assets/img/Landing1.svg";
import MovingHome from "@/assets/img/Landing2.svg";
import MovingBusiness from "@/assets/img/Landing3.svg";
import Button from "@/components/ui/Button";
import MovingSmallMd from "@/assets/img/Landing_md_01.svg";
import MovingHomeMd from "@/assets/img/Landing_md_02.svg";
import MovingBusinessMd from "@/assets/img/Landing_md_03.svg";
import Image from "next/image";

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#F4F7FB] outline-none">
      <div className="flex min-h-screen flex-col items-center justify-between caret-transparent outline-none focus:ring-0">
        <p className="pt-32 pb-8 text-center font-[Pretendard] text-[24px] leading-[50px] font-semibold text-black outline-none lg:text-[36px]">
          원하는 이사 서비스를 요청하고 <br />
          견적을 받아보세요.
        </p>

        <div className="flex flex-col outline-none lg:h-[600px] lg:flex-row lg:items-stretch lg:gap-0">
          <Image
            src={MovingSmall.src}
            className="cursor-pointer outline-none lg:hidden"
            alt=""
            width={100}
            height={100}
          />
          <Image
            src={MovingSmallMd.src}
            className="hidden cursor-pointer outline-none lg:block lg:h-[508px] lg:w-[432px] lg:object-contain"
            alt=""
            width={100}
            height={100}
          />

          <div className="flex flex-col outline-none lg:h-[508px] lg:w-[604px] lg:gap-0">
            <Image
              src={MovingHome.src}
              className="cursor-pointer outline-none lg:hidden"
              alt=""
              width={100}
              height={100}
            />
            <Image
              src={MovingHomeMd.src}
              className="hidden cursor-pointer outline-none lg:block lg:h-[287px] lg:w-[764px] lg:object-contain"
              alt=""
              width={100}
              height={100}
            />

            <Image
              src={MovingBusiness.src}
              className="cursor-pointer outline-none lg:hidden"
              alt=""
              width={100}
              height={100}
            />
            <Image
              src={MovingBusinessMd.src}
              className="hidden cursor-pointer outline-none lg:block lg:h-[287px] lg:w-[764px] lg:object-contain"
              alt=""
              width={100}
              height={100}
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
