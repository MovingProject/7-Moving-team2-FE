import ProfileViewer from "@/components/ui/profile/ProfileViewer";
import DefaultCard from "@/components/ui/card/DefaultCard";
import ProfileCard from "@/components/ui/card/ProfileCard";
import OrderCard from "@/components/ui/card/OrderCard";
import RequestCard from "@/components/ui/card/RequestCard";
import ReviewCard from "@/components/ui/card/ReviewCard";
import { getRandomProfileImage } from "@/utils/constant/getProfileImage";
import { QuotationData, RequestData, ReviewData, UserData } from "@/types/card";

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

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await fetchUser(id);

  const defaultCardData: {
    user: UserData;
    request: RequestData;
    quotation: QuotationData;
  } = {
    user: {
      userId: "user-driver-001",
      name: "홍길동",
      role: "DRIVER",
      profile: {
        driverId: "drv-001",
        nickname: "홍길동 기사님2",
        oneLiner: "고객님의 물품을 소중하고 안전하게 운송하여 드립니다.",
        image: getRandomProfileImage(),

        reviewCount: 45,
        rating: 4.8,
        careerYears: 7,
        confirmedCount: 187,
        driverServiceTypes: ["SMALL_MOVE", "HOME_MOVE"],
        driverServiceAreas: ["SEOUL", "GYEONGGI"],

        likes: {
          likedCount: 36,
          isLikedByCurrentUser: true,
        },
      },
    },
    request: {
      requestId: "req-789",
      serviceType: ["SMALL_MOVE"],
      departureAddress: "서울시 강남구",
      arrivalAddress: "경기도 성남시",
      requestStatement: "PENDING",
      moveAt: "2025-10-15",
      createdAt: "2025-09-25",
    },
    quotation: {
      quotationId: "q-123",
      departureAddress: "서울시 강남구",
      arrivalAddress: "경기도 성남시",
      quotationStatement: "SUBMITTED",
      price: 180000,
      moveAt: "2025-10-15",
      createdAt: "2025-09-25",
    },
  };

  const orderCardData: {
    user: UserData;
    request: RequestData;
    quotation: QuotationData;
  } = {
    user: defaultCardData.user,
    request: {
      ...defaultCardData.request,
      requestStatement: "CONFIRMED",
    },
    quotation: {
      ...defaultCardData.quotation,
      quotationStatement: "ACCEPTED",
    },
  };

  const profileCardData: {
    user: UserData;
  } = {
    user: defaultCardData.user,
  };

  const requestCardData: {
    user: UserData;
    request: RequestData;
    quotation?: QuotationData;
  } = {
    user: {
      userId: "user-consumer-001",
      name: "김철수",
      role: "CONSUMER",
    },
    request: {
      requestId: "req-789",
      serviceType: ["SMALL_MOVE"],
      departureAddress: "인천시 남동구",
      arrivalAddress: "경기도 고양시",
      requestStatement: "PENDING",
      moveAt: "2024-07-01",
      createdAt: "2025-09-25",
    },
    quotation: {
      ...defaultCardData.quotation,
      quotationStatement: "ACCEPTED",
    },
  };
  const requestCardData2: {
    user: UserData;
    request: RequestData;
    quotation?: QuotationData;
  } = {
    user: requestCardData.user,
    request: {
      ...requestCardData.request,
      requestStatement: "COMPLETED",
    },
  };

  const reviewCardData: {
    user: UserData;
    request: RequestData;
    quotation?: QuotationData;
    review: ReviewData;
  } = {
    user: defaultCardData.user,
    request: {
      ...defaultCardData.request,
      requestStatement: "CONFIRMED",
      moveAt: "2025-09-01",
    },
    review: {
      rating: 4.5,
      content:
        "처음 견적 받아봤는데, 엄청 친절하시고 꼼꼼하세요! 귀찮게 이것저것 물어봤는데 잘 알려주셨습니다. 원룸 이사는 믿고 맡기세요! :)",
      createdAt: "2025-09-01",
    },
  };

  return (
    <>
      <p>- 기본 기사 카드 : 1.인사말 / 2.가격</p>
      <DefaultCard
        user={defaultCardData.user}
        request={defaultCardData.request}
        quotation={defaultCardData.quotation}
      />
      <br />
      <p>- 대기 내역 등 주문 카드</p>
      {/* UserProfileArea 컴포넌트 사용 : 이미지, 이름, 이사정보 */}
      <OrderCard
        user={orderCardData.user}
        request={orderCardData.request}
        quotation={orderCardData.quotation}
      />
      <br />
      <p>- 프로필 카드</p>
      {/* UserProfileArea 컴포넌트 사용 : 이사 경력, 서비스, 지역 */}
      <ProfileCard user={profileCardData.user} />
      {/* UserProfileArea 컴포넌트 사용 : 이미지, 이름, 인사말 */}
      <br />
      <p>- 요청 카드</p>
      <RequestCard
        user={requestCardData.user}
        request={requestCardData.request}
        quotation={requestCardData.quotation}
      />
      <RequestCard
        user={requestCardData2.user}
        request={requestCardData2.request}
        quotation={requestCardData2.quotation}
      />
      <br />
      <p>- 리뷰 카드</p>
      <ReviewCard
        user={reviewCardData.user}
        request={reviewCardData.request}
        quotation={reviewCardData.quotation}
        review={reviewCardData.review}
      />
      <br />
      <p>- 프로필 이미지 컴포넌트 단독 사용 예시</p>
      {/**----------------------------------------------------------- */}
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center">
          {/* ProfileImage 컴포넌트 사용 : 랜덤 이미지 */}
          <ProfileViewer initialImageUrl={getRandomProfileImage()} size="sm" />

          {/* ProfileImage 컴포넌트 사용 : 저장된 번호 불러오기 */}
          <ProfileViewer initialImageUrl={user.profileImageUrl} />
        </div>
      </div>
    </>
  );
}
