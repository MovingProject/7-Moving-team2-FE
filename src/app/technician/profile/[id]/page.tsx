import ProfileViewer from "@/components/ui/profile/ProfileViewer";
import { getRandomProfileImage } from "@/utils/constant/getProfileImage";

async function fetchUser(userId: string) {
  if (userId === "random") {
    const randomImageUrl = getRandomProfileImage();
    return { name: "랜덤 테스트", profileImageUrl: randomImageUrl };
  } else {
    return {
      name: "업로드 테스트",
      profileImageUrl: "https://codeit-images.codeit.com/profile/default_profile.png",
    };
  }
}

export default async function ProfilePage({ params }: { params: { id: string } }) {
  const user = await fetchUser(params.id);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="flex flex-col items-center">
        {/* ProfileImage 컴포넌트 사용 : 랜덤 이미지 */}
        <ProfileViewer initialImageUrl={getRandomProfileImage()} size="sm" />

        {/* ProfileImage 컴포넌트 사용 : 저장된 번호 불러오기 */}
        <ProfileViewer initialImageUrl={user.profileImageUrl} />
      </div>
    </div>
  );
}
