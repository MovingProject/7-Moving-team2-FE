import SmallMoveIcon from "@/assets/icon/SmallMoveIcon.svg";
/**
 * Tag 컴포넌트
 *
 * @param type - 태그의 종류 (예: "primary", "secondary")
 * @param size - 태그의 크기 (예: "sm", "md", "lg")
 *
 * @example
 * <Tag type="primary" size="md" />
 */
interface TagPros {
  type: string;
  size: string;
  content: string;
}

export default function Tag({ type, size, content }: TagPros) {
  return (
    <div>
      <img></img>
      <p>{content}</p>
    </div>
  );
}
