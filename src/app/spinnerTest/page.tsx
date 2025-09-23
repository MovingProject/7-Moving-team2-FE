// app/test/page.tsx
export default async function TestPage() {
  // 의도적으로 3초 지연
  await new Promise((r) => setTimeout(r, 3000));

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-20">
      <h1>로고 스피너 테스트 페이지</h1>
    </div>
  );
}
