import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import Button from "../Button";

export interface NodataAreaProps {
  content: string;
  imagePath?: string;
  className?: string;
  width?: number;
  height?: number;
  linkPath?: string;
  linkText?: string;
}

export default function NodataArea({
  content = "현재 표시할 데이터가 없습니다.",
  imagePath = "/images/empty.svg",
  width = 184,
  height = 136,
  className,
  linkPath,
  linkText,
}: NodataAreaProps) {
  const isShowLinkButton = linkPath && linkText;
  return (
    <div className={clsx("flex items-center justify-center py-20 lg:py-45", className)}>
      <div className="flex flex-col items-center justify-center gap-6 lg:gap-8">
        <Image src={imagePath} width={width} height={height} alt="노데이터 이미지" />
        <p className="text-sm text-gray-500 lg:text-xl">{content}</p>
        {isShowLinkButton && (
          <Link href={linkPath} passHref>
            <Button size="md" textSize="mobile" text={linkText} />
          </Link>
        )}
      </div>
    </div>
  );
}
