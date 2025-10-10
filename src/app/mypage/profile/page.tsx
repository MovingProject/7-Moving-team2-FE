// app/profile/page.tsx

import {
  DriverUser,
  ConsumerUser,
  ConsumerProfileData,
  DriverProfileData,
  UserData,
} from "@/types/card";
import ConsumerProfileForm from "./components/ConsumerProfileForm";
import DriverProfileForm from "./components/DriverProfileForm";

async function getCurrentUser(): Promise<UserData | null> {
  const isDriver = true; // 테스트를 위해 Driver/Consumer를 전환 가능

  if (isDriver) {
    // 스키마에 맞춘 목데이터 (수정 모드 테스트용)
    // const driverProfile: DriverProfileData = {
    //   driverId: "d-id-123",
    //   nickname: "베스트 드라이버",
    //   image: "/images/avatars/avatartion1.jpg",
    //   reviewCount: 10,
    //   rating: 4.8,
    //   careerYears: 5,
    //   confirmedCount: 200,
    //   likes: {},
    //   oneLiner: "안전하고 빠른 이사를 약속드립니다",
    //   description:
    //     "10년 경력의 전문 이사 기사입니다. 고객만족을 최우선으로 생각하며, 안전하고 신속한 서비스를 제공합니다.",
    //   services: ["소형이사", "가정이사"],
    //   regions: ["서울", "경기", "인천"],
    // } as DriverProfileData;

    // 등록 모드 테스트하려면 아래 주석 해제하고 위 코드 주석처리
    const driverProfile: DriverProfileData | null = null;

    const driverUser: DriverUser = {
      userId: "d123",
      name: "홍길동",
      role: "DRIVER",
      profile: driverProfile,
      phoneNumber: "010-1234-5678",
    };
    return driverUser;
  } else {
    const consumerProfile: ConsumerProfileData | null = null;
    // const consumerProfile: ConsumerProfileData | null = {
    //  consumerId: "c-id-456",
    // image: "/images/avatars/avatartion5.jpg",
    // serviceType: []
    // areas:
    // };

    const consumerUser: ConsumerUser = {
      userId: "c456",
      name: "김철수",
      role: "CONSUMER",
      profile: consumerProfile,
      phoneNumber: "010-9876-5432",
    };
    return consumerUser;
  }
}

// ----------------------------------------------------
// 메인 서버 컴포넌트
// ----------------------------------------------------
export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) {
    // 인증되지 않은 사용자 처리
    return <div>로그인이 필요합니다.</div>;
  }

  if (user.role === "DRIVER") {
    const profileData = user.profile as DriverProfileData;

    return (
      <main className="container mx-auto p-4">
        <DriverProfileForm initialData={profileData} userId={user.userId} />
      </main>
    );
  } else {
    // user.role === "CONSUMER"
    const profileData = user.profile as ConsumerProfileData;
    return (
      <main className="container mx-auto px-4 lg:max-w-[686px]">
        <ConsumerProfileForm initialData={profileData} />
      </main>
    );
  }
}
