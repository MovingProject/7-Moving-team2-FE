// src/utils/adapters/quoteAdapter.ts
import {
  DriverUser,
  RequestData,
  QuotationData,
  DriverProfileData,
  ConsumerUser,
  UserData,
} from "@/types/card";
import {
  ApiCustomerRequestWithQuotations,
  ApiDriverQuotationItem,
  ApiQuotation,
  DriverQuotationListItem,
} from "@/types/quotation"; // 새로 정의한 API 타입

// QuotationArea가 요구하는 최종 출력 타입 (변경 없음)
export interface AdaptedQuotationData {
  user: DriverUser;
  request: RequestData;
  quotation: QuotationData;
}

/**
 * 하나의 API 응답 Request 객체를 받아서, QuotationArea에서 사용할 수 있는 구조로 변환합니다.
 */
export const adaptRequestToQuotationAreaData = (
  request: ApiCustomerRequestWithQuotations // 변경된 API 응답 타입 사용
): AdaptedQuotationData[] => {
  const requestInfo: RequestData = {
    requestId: request.id,
    serviceType: request.serviceType,
    departureAddress: request.departureAddress,
    arrivalAddress: request.arrivalAddress,
    requestStatement: request.requestStatus,
    moveAt: request.moveAt,
    createdAt: request.createdAt,
  };

  return request.quotations.map((quo: ApiQuotation) => {
    // 2. QuotationData 구조 매핑
    const quotationData: QuotationData = {
      quotationId: quo.id,
      serviceType: quo.serviceType,
      departureAddress: requestInfo.departureAddress,
      arrivalAddress: requestInfo.arrivalAddress,
      quotationStatement: quo.status,
      chattingRoomId: quo.chattingRoomId,
      isInvited: quo.isInvited,
      price: quo.price,
      moveAt: requestInfo.moveAt,
    };

    // 3. DriverProfileData 구조 매핑 (ApiQuotation.driverProfile -> DriverProfileData)
    const driverProfile: DriverProfileData = {
      driverId: quo.driverProfile.id,
      nickname: quo.driverProfile.nickname,
      oneLiner: quo.driverProfile.oneLiner,
      image: quo.driverProfile.image,
      reviewCount: quo.driverProfile.reviewCount,
      rating: quo.driverProfile.rating,
      careerYears: quo.driverProfile.careerYears,
      confirmedCount: quo.driverProfile.confirmedCount,
      description: undefined,
      driverServiceTypes: undefined,
      driverServiceAreas: undefined,
      likes: {
        likedCount: quo.driverProfile.likeCount,
        isLikedByCurrentUser: quo.isLiked,
      },
    };

    // 4. UserData (DriverUser) 구조 매핑
    const driverUser: DriverUser = {
      userId: quo.id,
      name: quo.driverProfile.nickname,
      role: "DRIVER",
      nickname: quo.driverProfile.nickname,
      email: quo.driverProfile.email || `temp-${quo.id}@example.com`,
      phoneNumber: quo.driverProfile.phoneNumber || `010-0000-0000`,
      profile: driverProfile,
    };

    return {
      user: driverUser,
      request: requestInfo,
      quotation: quotationData,
    };
  });
};

/**
 * API에서 받은 기사 견적 항목을 클라이언트 UI에서 사용할 DriverQuotationListItem 타입으로 변환합니다.
 */
// RequestCard가 기대하는 Props 구조
interface RequestCardProps {
  user: UserData; // ConsumerUser (고객 정보)
  request: RequestData;
  quotation: QuotationData;
}

/**
 * DriverQuotationListItem을 RequestCard의 Props 구조로 변환합니다.
 */
export const adaptDriverItemToRequestCardProps = (
  item: DriverQuotationListItem
): RequestCardProps => {
  // 1. UserData (고객 정보): Driver API는 고객 이름을 제공하므로 이를 활용하여 Mock ConsumerUser를 만듭니다.
  const consumerUser: ConsumerUser = {
    userId: item.requestSummary.requestId, // 요청 ID를 userId로 임시 사용
    name: item.requestSummary.consumerName,
    role: "CONSUMER",
    email: `mock-${item.requestSummary.requestId}@user.com`, // Mock
    phoneNumber: "000-0000-0000", // Mock
  };

  // 2. RequestData (요청 정보): 견적 목록 API의 요약 정보를 활용합니다.
  const requestData: RequestData = {
    requestId: item.requestSummary.requestId,
    serviceType: item.serviceType, // serviceType은 이미 배열로 변환됨
    departureAddress: item.requestSummary.departureAddress,
    arrivalAddress: item.requestSummary.arrivalAddress,
    requestStatement: "PENDING",
    moveAt: item.requestSummary.moveAt,
    createdAt: item.requestSummary.moveAt, // 요청 생성일 정보가 없으므로 moveAt으로 대체
  };

  // 3. QuotationData (견적 정보): 견적 금액과 상태를 활용합니다.
  const quotationData: QuotationData = {
    quotationId: item.quotationId,
    price: item.price,
    quotationStatement: item.quotationStatement,

    // RequestCard가 QuotationData에서 기대하는 필수 필드가 있다면 Mock 데이터 추가
    departureAddress: item.requestSummary.departureAddress,
    arrivalAddress: item.requestSummary.arrivalAddress,
    moveAt: item.requestSummary.moveAt,
    createdAt: item.requestSummary.moveAt,
  };

  return {
    user: consumerUser,
    request: requestData,
    quotation: quotationData,
  };
};

export const adaptApiToDriverQuotationListItem = (
  apiItem: ApiDriverQuotationItem
): DriverQuotationListItem => {
  return {
    // 1. 견적 데이터 매핑
    quotationId: apiItem.id,
    price: apiItem.price,
    quotationStatement: apiItem.quotationStatus,

    // 2. 서비스 타입 배열 변환
    // API에서 단일 문자열로 오지만, UI에서 배열을 기대하므로 배열로 감쌉니다.
    serviceType: [apiItem.serviceType],

    // 3. 요청 요약 정보 매핑
    requestSummary: {
      // 요청 ID는 API에 없으므로 견적 ID(apiItem.id)를 임시로 사용
      requestId: apiItem.id,
      consumerName: apiItem.consumerName,
      departureAddress: apiItem.departureAddress,
      arrivalAddress: apiItem.arrivalAddress,
      moveAt: apiItem.moveAt,
    },

    // 4. Mock 필드 할당
    // 고객 응답/조회 여부는 API에 없으므로 기본값(Mock)을 할당합니다.
    isCustomerSeen: false,
  };
};

/**
 *  기사 견적 목록 API 응답 전체 (배열)를 변환합니다.
 */
export const adaptApiDriverQuotationList = (
  apiList: ApiDriverQuotationItem[] | null | undefined
): DriverQuotationListItem[] => {
  if (!Array.isArray(apiList)) {
    // 배열이 아니거나 null/undefined이면 빈 배열을 반환하여 map() 호출을 방지합니다.
    return [];
  }

  // 배열일 경우에만 안전하게 map()을 사용합니다.
  return apiList.map(adaptApiToDriverQuotationListItem);
};
