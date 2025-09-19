import Image from "next/image";
import clsx from "clsx";

interface ProfileImageProps {
  src: string;
  size?: "sm" | "md" | "lg";
  shape?: "circle" | "square";
}

const sizeClasses = {
  sm: "w-12 h-12",
  md: "w-21 h-21",
  lg: "w-40 h-40",
};

export default function ProfileImage({ src, size = "md", shape = "circle" }: ProfileImageProps) {
  const containerClasses = clsx("relative", "overflow-hidden", sizeClasses[size], {
    "rounded-full": shape === "circle",
    "rounded-lg": shape === "square",
  });
  return (
    <div className={containerClasses}>
      <Image src={src} alt="프로필 이미지" fill className="object-cover" />
    </div>
  );
}
