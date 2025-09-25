import Input from "@/components/ui/Input";

interface InputAreaProps {
  label: string;
}

export default function InputArea({ label }: InputAreaProps) {
  return (
    <>
      <label className="">{label}</label>
      <Input className="bg-[#F7F7F7]" type="basic" value="a" onChange={() => {}}></Input>
    </>
  );
}
