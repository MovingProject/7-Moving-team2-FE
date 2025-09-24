import Popup from "@/components/ui/Popup";

export default function PopupTest() {
  return (
    <div className="space-y-6 p-10">
      <h2 className="text-lg font-semibold">팝업 테스트</h2>
      <div className="flex flex-col flex-wrap gap-4">
        <Popup type="info" size="sm" message="링크가 복사되었어요" />
        <Popup type="info" size="md" message="링크가 복사되었어요" />
        <Popup type="info" size="lg" message="링크가 복사되었어요" />
        <Popup type="warning" size="sm" message="확정하지 않은 견적이에요!" />
        <Popup type="warning" size="md" message="확정하지 않은 견적이에요!" />
        <Popup type="warning" size="lg" message="확정하지 않은 견적이에요!" />
      </div>
    </div>
  );
}
