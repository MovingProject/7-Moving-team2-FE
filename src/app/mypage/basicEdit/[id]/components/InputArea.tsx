import Input, { InputType } from "@/components/ui/Input";

interface InputAreaProps {
  label: string;
  type?: InputType; // basic | search | textArea
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  inputType?: string; // password, text 등
  size?: "full" | "half";
  error?: string;
}

export default function InputArea({
  label,
  type = "basic",
  value,
  onChange,
  placeholder,
  inputType = "text",
  size = "full",
  error,
}: InputAreaProps) {
  return (
    <div className="flex flex-col py-8">
      <label className="mb-2 text-sm font-semibold text-gray-700">{label}</label>
      <Input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        inputType={inputType}
        size={size}
        error={error}
      />
    </div>
  );
}
