import SmallMoveIcon from "@/assets/icon/SmallMoveIcon.svg";
import SmallMoveIconSm from "@/assets/icon/SmallMoveIcon-1.svg";
import HomeMoveIcon from "@/assets/icon/HomeMoveIcon.svg";
import HomeMoveIconSm from "@/assets/icon/HomeMoveIcon-1.svg";
import OfficeMoveIcon from "@/assets/icon/OfficeMoveIcon.svg";
import OfficeMoveIconSm from "@/assets/icon/OfficeMoveIcon-1.svg";

type IconType = "smallMove" | "homeMove" | "officeMove" | "default";
type IconSize = "default" | "sm";
type BoxType = "default" | "radius";

interface Icon {
  src: string;
  width: number;
  height: number;
}

interface TagProps {
  type: IconType;
  size: IconSize;
  content: string;
  borderType?: BoxType;
}

const iconMap: Record<Exclude<IconType, "default">, Record<IconSize, Icon>> = {
  smallMove: {
    default: SmallMoveIcon,
    sm: SmallMoveIconSm,
  },
  homeMove: {
    default: HomeMoveIcon,
    sm: HomeMoveIconSm,
  },
  officeMove: {
    default: OfficeMoveIcon,
    sm: OfficeMoveIconSm,
  },
};

export default function Tag({ type, size, content }: TagProps) {
  const iconSrc = type === "default" ? null : iconMap[type]?.[size] || iconMap[type]?.default;

  //TODO: borderType가 default일때 or radius일때 최상위 container가 바뀌는 조건만들어서 적용할것.

  return (
    <div className="flex gap-5 border border-red-500">
      {iconSrc ? (
        <img src={iconSrc.src} width={iconSrc.width} height={iconSrc.height} alt={`${type} icon`} />
      ) : (
        <div></div>
      )}
      <p>{content}</p>
    </div>
  );
}
