import Header from "./components/Header";
import ProfileSection from "./components/ProfileSection";
import ReviewContainer from "./components/ReviewContainer";

export default function Mypage() {
  return (
    <main className="min-h-screen w-full bg-white px-4 md:px-5 lg:px-8 xl:px-60">
      {/* 헤더 */}
      <Header />
      {/* 프로필 영역 */}
      <section className="mt-6 mb-12 px-6">
        <ProfileSection />
      </section>
      <section className="my-10 px-6">
        <div className="border-t border-gray-100" />
      </section>
      {/* 리뷰 영역 */}
      <section className="mt-10 mb-14 px-6">
        <ReviewContainer />
      </section>
    </main>
  );
}
