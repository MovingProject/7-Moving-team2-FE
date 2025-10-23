import { DriverItem, DriverDetailItem } from "@/types/driver";
import { DriverUser, RequestData } from "@/types/card";
import { MoveType } from "@/types/moveTypes";
import { AreaType } from "@/types/areaTypes";

export const mapDriverToCardData = (
  driver: DriverItem
): { user: DriverUser; request: RequestData } => ({
  user: {
    userId: driver.user.id,
    name: driver.user.name,
    role: "DRIVER",
    email: "",
    phoneNumber: "",
    profile: {
      driverId: driver.user.id,
      nickname: driver.profile.nickname,
      oneLiner: driver.profile.oneLiner ?? "",
      image: driver.profile.image ?? "",
      reviewCount: driver.profile.reviewCount,
      rating: driver.profile.rating,
      careerYears: driver.profile.careerYears,
      confirmedCount: driver.profile.confirmedCount,
      driverServiceTypes: driver.profile.serviceTypes as MoveType[],
      driverServiceAreas: driver.profile.serviceAreas as AreaType[],
      likes: {
        likedCount: driver.profile.likeCount,
        isLikedByCurrentUser: driver.profile.isLikedByCurrentUser ?? false,
      },
    },
  },
  request: {
    requestId: "",
    serviceType: driver.profile.serviceTypes as MoveType[],
    departureAddress: "",
    arrivalAddress: "",
    requestStatement: "PENDING",
    moveAt: "",
    createdAt: "",
  },
});

export const mapDriverDetailToDriverListShape = (data: DriverDetailItem): DriverItem => ({
  user: {
    id: data.id,
    name: data.name,
    role: "DRIVER",
    createdAt: "",
  },
  profile: {
    userId: data.id,
    image: data.image,
    nickname: data.nickname,
    oneLiner: data.oneLiner ?? "",
    description: data.description ?? "",
    careerYears: data.careerYears,
    rating: data.rating,
    reviewCount: data.reviewCount,
    confirmedCount: data.confirmedCount,
    likeCount: data.likeCount ?? 0,
    isLikedByCurrentUser: data.isLikedByCurrentUser ?? false,
    serviceAreas: data.serviceAreas as string[],
    serviceTypes: data.serviceTypes as string[],
  },
  isInvitedByMe: false,
});
