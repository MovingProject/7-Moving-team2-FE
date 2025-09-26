import ProfileViewer from "@/components/ui/profile/ProfileViewer";
import DefaultCard from "@/components/ui/card/DefaultCard";
import ProfileCard from "@/components/ui/card/ProfileCard";
import OrderCard from "@/components/ui/card/OrderCard";
import RequestCard from "@/components/ui/card/RequestCard";
import ReviewCard from "@/components/ui/card/ReviewCard";
import { getRandomProfileImage } from "@/utils/constant/getProfileImage";
import ChatBubble from "@/components/ui/ChatBubble";

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
  const { id } = await params;
  const user = await fetchUser(id);

  const defaultCardData = {
    profileData1: {
      greeting: "고객님의 물품을 소중하고 안전하게 운송하여 드립니다.",
      tags: [
        { type: "default", content: "견적 대기", size: "sm" },
        { type: "smallMove", content: "소형 이사", size: "sm" },
        { type: "requestQuote", content: "견적 요청", size: "sm" },
      ],
      name: "홍길동 기사님",
      imageUrl: getRandomProfileImage(),
      movingInfo: {
        rating: 4.8,
        career: 7,
        deals: 187,
      },
      likes: {
        count: 36,
        isLiked: true,
      },
    },
    profileData2: {
      price: 180000,
      tags: [
        { type: "default", content: "견적 대기", size: "sm" },
        { type: "smallMove", content: "소형 이사", size: "sm" },
        { type: "requestQuote", content: "견적 요청", size: "sm" },
      ],
      name: "홍길동 기사님",
      imageUrl: getRandomProfileImage(),
      movingInfo: {
        rating: 4.8,
        career: 7,
        deals: 187,
      },
      likes: {
        count: 36,
        isLiked: true,
      },
    },
  };

  const orderCardData = {
    price: 180000,
    profileData: {
      name: "홍길동 기사님",
      tags: [
        { type: "default", content: "견적 대기" },
        { type: "smallMove", content: "소형 이사" },
        { type: "requestQuote", content: "견적 요청" },
      ],
      imageUrl: getRandomProfileImage(),
      movingInfo: {
        rating: 4.8,
        career: 7,
        deals: 187,
      },
      likes: { count: 36, isLiked: true },
    },
  };

  const profileCardData = {
    name: "홍길동 기사님",
    greeting: "고객님의 물품을 소중하고 안전하게 운송하여 드립니다.",
    services: ["소형이사", "가정이사"],
    locals: ["서울", "경기"],
    imageUrl: getRandomProfileImage(),
    movingInfo: {
      rating: 4.8,
      career: 5,
      deals: 123,
    },
  };

  const requestCardData = {
    time: "1시간 전",
    tags: [
      { type: "default", content: "견적 대기", size: "sm" },
      { type: "smallMove", content: "소형 이사", size: "sm" },
      { type: "requestQuote", content: "견적 요청", size: "sm" },
    ],
    profileData: {
      name: "홍길동",
      movingInfo: {
        date: "2024. 07. 01(월)",
        departure: "인천시 남동구",
        destination: "경기도 고양시",
      },
      likes: {
        count: 36,
        isLiked: false,
      },
    },
  };

  const reviewCardData = {
    time: "1시간 전",
    tags: [
      { type: "smallMove", content: "소형 이사", size: "sm" },
      { type: "requestQuote", content: "견적 요청", size: "sm" },
    ],
    profileData: {
      name: "홍길동 기사님",
      imageUrl: getRandomProfileImage(),
      movingInfo: {
        date: "2024. 07. 01(월)",
        price: 300000,
      },
    },
    messages:
      "처음 견적 받아봤는데, 엄청 친절하시고 꼼꼼하세요! 귀찮게 이것저것 물어봤는데 잘 알려주셨습니다. 원룸 이사는 믿고 맡기세요! :)",
  };

  return (
    <>
      <p>- 기본 기사 카드 : 1.인사말 / 2.가격</p>
      <DefaultCard layoutSize="lg" size="sm" profileData={defaultCardData.profileData1} />
      <DefaultCard layoutSize="sm" size="sm" profileData={defaultCardData.profileData2} />
      <br />
      <p>- 대기 내역 등 주문 카드</p>
      {/* TechnicianProfile 컴포넌트 사용 : 이미지, 이름, 이사정보 */}
      <OrderCard
        layoutSize="lg"
        size="sm"
        price={orderCardData.price}
        profileData={orderCardData.profileData}
      />
      <br />
      <p>- 프로필 카드</p>
      {/* TechnicianProfile 컴포넌트 사용 : 이사 경력, 서비스, 지역 */}
      <ProfileCard layoutSize="sm" size="sm" profileData={profileCardData} />
      <ProfileCard profileData={profileCardData} />
      {/* TechnicianProfile 컴포넌트 사용 : 이미지, 이름, 인사말 */}
      <br />
      <p>- 요청 카드</p>
      <RequestCard
        size="sm"
        tags={requestCardData.tags}
        time={requestCardData.time}
        profileData={requestCardData.profileData}
      />
      <br />
      <p>- 리뷰 카드</p>
      <ReviewCard
        layoutSize="lg"
        size="sm"
        tags={reviewCardData.tags}
        time={reviewCardData.time}
        profileData={reviewCardData.profileData}
        messages={reviewCardData.messages}
      />
      <br />
      <p>- 프로필 이미지 컴포넌트 단독 사용 예시</p>
      {/**----------------------------------------------------------- */}
      <div className="flex items-center justify-center bg-gray-100 py-10">
        <div className="flex flex-col items-center">
          {/* ProfileImage 컴포넌트 사용 : 랜덤 이미지 */}
          <ProfileViewer initialImageUrl={getRandomProfileImage()} size="sm" />

          {/* ProfileImage 컴포넌트 사용 : 저장된 이미지 불러오기 */}
          <ProfileViewer initialImageUrl={user.profileImageUrl} />
        </div>
      </div>
      {/**----------------------------------------------------------- */}
      <div className="flex flex-col bg-gray-200 p-5">
        {/* ChatBubble 컴포넌트 적용 예시 */}
        <ChatBubble message="요청 보내는 사람" isMe={true} />
        <ChatBubble message="요청 받는 메세지박스" theme="white" />
      </div>
    </>
  );
}
