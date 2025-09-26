import Image from "next/image";
import clsx from "clsx";

interface ProfileImageProps {
  src: string;
  shape?: "circle" | "square";
}

const shapeClasses = {
  circle: "min-w-12 w-12 h-12 lg:min-w-21 lg:w-21 lg:h-21",
  square: "w-25 h-25 lg:min-w-40 lg:w-40 lg:h-40",
};

export default function ProfileImage({ src, shape = "circle" }: ProfileImageProps) {
  const containerClasses = clsx("relative", "border-2", "overflow-hidden", shapeClasses[shape], {
    "rounded-full": shape === "circle",
    "rounded-lg": shape === "square",
  });
  return (
    <div className={containerClasses}>
      <Image src={src} alt="프로필 이미지" fill className="object-cover" />
    </div>
  );
}
