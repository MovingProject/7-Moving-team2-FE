// src/utils/adapters/quoteAdapter.ts
import { DriverUser, RequestData, QuotationData, DriverProfileData } from "@/types/card";
import { ApiCustomerRequestWithQuotations, ApiQuotation } from "@/types/quotation"; // 새로 정의한 API 타입

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
      quotationStatement: "PENDING",
      price: quo.price,
      moveAt: requestInfo.moveAt,
    };

    // 3. DriverProfileData 구조 매핑 (ApiQuotation.driverProfile -> DriverProfileData)
    const driverProfile: DriverProfileData = {
      driverId: `drv-${quo.id}`, // Driver ID가 API에 없다면 임시로 생성
      nickname: quo.driverProfile.nickname,
      oneLiner: quo.driverProfile.oneLiner,
      image: null,
      reviewCount: quo.driverProfile.reviewCount,
      rating: quo.driverProfile.rating,
      careerYears: quo.driverProfile.careerYears,
      confirmedCount: quo.driverProfile.confirmedCount,
      description: undefined,
      driverServiceTypes: undefined,
      driverServiceAreas: undefined,
      likes: {
        likedCount: quo.driverProfile.likeCount,
        isLikedByCurrentUser: false,
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
