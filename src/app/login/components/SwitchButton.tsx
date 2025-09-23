import { useState } from "react";

export default function SwitchButton() {
  const [selected, setSelected] = useState<"student" | "teacher">("student");

  return (
    <div className="relative flex h-12 w-64 rounded-full bg-gray-200 p-1">
      <div
        className={`absolute h-10 w-30 transform rounded-full bg-[#1B92FF] shadow-md transition-transform duration-300 ${
          selected === "teacher" ? "translate-x-32" : "translate-x-0"
        }`}
      ></div>

      <button
        className={`relative z-10 flex flex-1 items-center justify-center text-lg font-medium transition-colors duration-300 ${
          selected === "student" ? "text-white" : "text-gray-600"
        }`}
        onClick={() => setSelected("student")}
      >
        고객
      </button>

      <button
        className={`relative z-10 flex flex-1 items-center justify-center text-lg font-medium transition-colors duration-300 ${
          selected === "teacher" ? "text-white" : "text-gray-600"
        }`}
        onClick={() => setSelected("teacher")}
      >
        기사
      </button>
    </div>
  );
}
