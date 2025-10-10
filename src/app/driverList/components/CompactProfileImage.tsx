import Image from "next/image";
import clsx from "clsx";

interface CompactProfileImageProps {
  src: string;
  shape?: "circle" | "square";
}

const compactShapeClasses = {
  circle: "min-w-9 w-9 h-9 lg:min-w-10 lg:w-10 lg:h-10",
  square: "w-20 h-20 lg:w-24 lg:h-24",
};

export default function CompactProfileImage({ src, shape = "circle" }: CompactProfileImageProps) {
  const containerClasses = clsx(
    "relative overflow-hidden border border-black",
    compactShapeClasses[shape],
    {
      "rounded-full": shape === "circle",
      "rounded-lg": shape === "square",
    }
  );

  return (
    <div className={containerClasses}>
      <Image src={src} alt="프로필 이미지" fill className="object-cover" />
    </div>
  );
}
