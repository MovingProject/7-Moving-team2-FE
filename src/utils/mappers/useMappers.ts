import type { User } from "@/store/authStore";
import type { UserData, DriverProfileData, ConsumerProfileData } from "@/types/card";

/** UserData → authStore.User (prev가 있으면 createdAt, profileId 유지) */
export function mapUserDataToAuthUser(userData: UserData, prev?: User | null): User {
  // 프로필 등록 여부 계산
  let isProfileRegistered = false;
  let nickname: string | undefined;

  if (userData.role === "DRIVER") {
    const p = userData.profile as DriverProfileData | null; // role로 이미 분기되므로 안전
    nickname = p?.nickname ?? prev?.nickname;
    isProfileRegistered = !!(
      p &&
      (p.nickname?.trim() ||
        (p.driverServiceTypes && p.driverServiceTypes.length > 0) ||
        (p.driverServiceAreas && p.driverServiceAreas.length > 0))
    );
  } else {
    const p = (userData.profile ?? null) as ConsumerProfileData | null;
    isProfileRegistered = !!(p && (p.serviceType || p.areas));
  }

  return {
    id: userData.userId,
    email: userData.email,
    name: userData.name,
    role: userData.role ?? prev?.role ?? "CONSUMER",
    // /users/me에는 createdAt이 없을 수 있으니 이전 값 보존, 없으면 합리적 기본값
    createdAt: prev?.createdAt ?? new Date(0).toISOString(),
    isProfileRegistered,
    // /users/me 응답에 profileId가 없을 수 있으니 이전 값 보존
    profileId: prev?.profileId,
    nickname,
  };
}
