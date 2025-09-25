import Input from "@/components/ui/Input";
import { InputType } from "@/components/ui/Input";

interface InputAreaProps {
  label: string;
  type?: InputType;
}

export default function InputArea({ label, type = "basic" }: InputAreaProps) {
  return (
    <>
      <label className="">{label}</label>
      <Input className="bg-[#F7F7F7]" type={type} value="a" onChange={() => {}}></Input>
    </>
  );
}
