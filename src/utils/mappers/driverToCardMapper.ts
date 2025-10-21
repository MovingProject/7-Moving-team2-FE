import { DriverListItem } from "@/types/driver";
import { DriverUser, RequestData } from "@/types/card";
import { MoveType } from "@/types/moveTypes";
import { AreaType } from "@/types/areaTypes";

export const mapDriverToCardData = (
  driver: DriverListItem
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
        isLikedByCurrentUser: false,
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
