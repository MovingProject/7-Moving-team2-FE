"use client";
import Input from "@/components/ui/Input";
import InputArea from "./components/InputArea";
import upload from "@/assets/img/upload.svg";
import ImageInputArea from "./components/ImageInputArea";
import TagForm from "./components/TagForm";

export default function Edit() {
  const regions = [
    "서울",
    "경기",
    "인천",
    "강원",
    "충북",
    "충남",
    "세종",
    "대전",
    "전북",
    "전남",
    "광주",
    "경북",
    "경남",
    "대구",
    "울산",
    "부산",
    "제주",
  ];
  return (
    <div>
      <p className="border-b border-gray-500 pb-4 text-[18px] leading-[26px] font-bold text-[#1F1F1F]">
        프로필수정
      </p>
      <div>
        <div>
          <InputArea label="별명" />
          {/* TODO : 일단 틀만구현하고 style은 추후에 컴포넌트수정후 변경하셈 */}
          <ImageInputArea />
          <InputArea label="경력" />
          <InputArea label="한 줄 소개" />
        </div>
        <div>
          <TagForm
            Tags={["소형이사", "가정이사", "사무실이사"]}
            label="상세설명"
            colType="flex"
          ></TagForm>
          <TagForm Tags={regions} label="가능구역" colType="grid"></TagForm>
        </div>
      </div>
      <div>버튼</div>
    </div>
  );
}
