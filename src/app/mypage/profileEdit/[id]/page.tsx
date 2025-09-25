"use client";
import Input from "@/components/ui/Input";
import InputArea from "./components/InputArea";
import upload from "@/assets/img/upload.svg";
import ImageInputArea from "./components/ImageInputArea";

export default function Edit() {
  return (
    <div>
      <p className="border-b border-gray-500 pb-4 text-[18px] leading-[26px] font-bold text-[#1F1F1F]">
        프로필수정
      </p>
      <div>
        <div>
          <form>
            <InputArea label="별명" />
            {/* TODO : 일단 틀만구현하고 style은 추후에 컴포넌트수정후 변경하셈 */}
            <ImageInputArea />
            <InputArea label="경력" />
            <InputArea label="한 줄 소개" />
          </form>
        </div>
        <div>태그폼?</div>
      </div>
      <div>버튼</div>
    </div>
  );
}
