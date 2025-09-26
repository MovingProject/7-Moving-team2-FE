import Input from "@/components/ui/Input";
import { InputType } from "@/components/ui/Input";
import clsx from "clsx";

interface InputAreaProps {
  label: string;
  type?: InputType;
  borderOption?: "not";
}

export default function InputArea({ label, type = "basic", borderOption }: InputAreaProps) {
  const containerClass = clsx("mt-4 pb-8", borderOption !== "not" && "border-b border-[#F2F2F2]");
  return (
    <div className={containerClass}>
      <label className="font-Pretendard text-[16px] leading-[26px] font-semibold text-[var(--Black-Black-300,#373737)]">
        {label}
      </label>
      <Input className="bg-[#f1efef]" type={type} value="a" onChange={() => {}}></Input>
    </div>
  );
}
