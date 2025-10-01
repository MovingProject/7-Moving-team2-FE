import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function DriverProfileForm() {
  const fields = [
    { key: "nickName", label: "별명", placeholder: "사이트에 노출될 별명을 입력해 주세요" },
    { key: "history", label: "경력", placeholder: "기사님의 경력을 입력해 주세요" },
    { key: "overView", label: "한 줄 소개", placeholder: "한 줄 소개를 입력해 주세요" },
    {
      key: "detils",
      label: "상세 설명",
      placeholder: "상세 내용을 입력해 주세요",
      type: "textArea",
    },
    { key: "service", label: "제공 서비스" },
    { key: "serviceArea", label: "서비스 가능 지역 " },
  ];

  return (
    <div>
      <div>
        <h2>기사님 프로필 등록</h2>
        <span>추가 정보를 입력하여 회원가입을 완료해주세요.</span>
      </div>

      <form>
        <div>
          <label>프로필 이미지</label>
        </div>

        <div>
          <label>제공 서비스</label>
          <label>서비스 가능 지역*</label>
          <Button size="md" type="submit" text="시작하기" disabled />
        </div>
      </form>
    </div>
  );
}
