import clsx from "clsx";
import Image from "next/image";

export interface NodataAreaProps {
  content: string;
  imagePath?: string;
  className?: string;
  width?: number;
  height?: number;
}

export default function NodataArea({
  content = "현재 표시할 데이터가 없습니다.",
  imagePath = "/images/empty.svg",
  width = 184,
  height = 136,
  className,
}: NodataAreaProps) {
  return (
    <div className={clsx("flex items-center justify-center py-20 lg:py-45", className)}>
      <div className="flex flex-col items-center justify-center gap-6 lg:gap-8">
        <Image src={imagePath} width={width} height={height} alt="노데이터 이미지" />
        <p className="text-sm text-gray-500 lg:text-xl">{content}</p>
      </div>
    </div>
  );
}
