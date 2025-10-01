"use client";
import Input from "@/components/ui/Input";
import InputArea from "../components/InputArea";
import upload from "@/assets/img/upload.svg";
import ImageInputArea from "../components/ImageInputArea";
import TagForm from "../components/TagForm";
import Button from "@/components/ui/Button";
import { useState } from "react";

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
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  return (
    <div className="flex items-center justify-center">
      <div className="mt-5 flex w-full max-w-[424px] flex-col items-center justify-center p-6 lg:max-w-[1200px]">
        <div className="flex w-full flex-col lg:flex-row lg:gap-15">
          <div className="flex w-full flex-col gap-4 lg:w-1/2">
            <div className="w-full">
              <div className="flex w-full">
                <p className="w-full border-b border-[#F2F2F2] pb-4 text-[18px] leading-[26px] font-bold text-[#1F1F1F]">
                  프로필수정
                </p>
              </div>
              <InputArea label="별명" />
              <ImageInputArea />
              <InputArea label="경력" />
              <InputArea label="한 줄 소개" />

              <div className="mt-4 lg:hidden">
                <TagForm
                  Tags={["소형이사", "가정이사", "사무실이사"]}
                  label="상세설명"
                  colType="flex"
                  selectedTags={selectedServices}
                  setSelectedTags={setSelectedServices}
                />
                <TagForm
                  selectedTags={selectedServices}
                  setSelectedTags={setSelectedServices}
                  Tags={regions}
                  label="가능구역"
                  colType="grid"
                />
              </div>
            </div>

            <div className="mt-4 w-full">
              <InputArea label="상세 설명" type="textArea" borderOption="not" />
            </div>
          </div>

          <div className="hidden gap-4 lg:flex lg:w-1/2 lg:flex-col">
            <TagForm
              selectedTags={selectedServices}
              setSelectedTags={setSelectedServices}
              Tags={["소형이사", "가정이사", "사무실이사"]}
              label="상세설명"
              colType="flex"
            />
            <TagForm
              selectedTags={selectedServices}
              setSelectedTags={setSelectedServices}
              Tags={regions}
              label="가능구역"
              colType="grid"
            />
          </div>
        </div>

        <div className="mt-4 flex w-full flex-col gap-3 lg:w-full lg:flex-row">
          <Button className="w-full lg:order-2" text="수정하기" />
          <Button className="w-full lg:order-1" variant="secondary" text="취소" />
        </div>
      </div>
    </div>
  );
}
