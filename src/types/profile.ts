export type Area =
  | "SEOUL"
  | "GYEONGGI"
  | "INCHEON"
  | "GANGWON"
  | "CHUNGBUK"
  | "CHUNGNAM"
  | "SEJONG"
  | "DAEJEON"
  | "JEONBUK"
  | "JEONNAM"
  | "GWANGJU"
  | "GYEONGBUK"
  | "GYEONGNAM"
  | "DAEGU"
  | "ULSAN"
  | "BUSAN"
  | "JEJU";
export type MoveType = "SMALL_MOVE" | "HOME_MOVE" | "OFFICE_MOVE";

export interface DriverProfileData {
  image?: string;
  nickname?: string;
  careerYears?: string;
  oneLiner?: string;
  description?: string;
  rating?: number;
  driverServiceAreas?: Area[];
  driverServiceTypes?: MoveType[];
}

export interface ConsumerProfileData {
  image?: string;
  serviceType?: MoveType;
  areas?: Area;
}

export type UserProfileResponse =
  | { role: "DRIVER"; driverProfile: DriverProfileData; consumerProfile: null }
  | { role: "CONSUMER"; consumerProfile: ConsumerProfileData; driverProfile: null };

export interface UpdateUserProfileDto {
  driverProfile?: DriverProfileData;
  consumerProfile?: ConsumerProfileData;
}
