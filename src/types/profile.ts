import { DriverProfileData, ConsumerProfileData } from "@/types/card";

// 프로필 수정 (PATCH) 요청용 DTO

export interface UpdateUserProfileDto {
  driverProfile?: Partial<DriverProfileData>;
  consumerProfile?: Partial<ConsumerProfileData>;
}
