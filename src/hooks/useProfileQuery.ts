import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserProfile, updateBasicInfo, getUserProfile } from "@/utils/hook/profile/profile";
import { useUserStore } from "@/store/userStore";
import {
  UserData,
  UpdateUserProfileRequest,
  UpdateBasicInfoRequest,
  ProfileUpdateResponse,
  DriverProfileData,
  ConsumerProfileData,
} from "@/types/card";

/**
 * 백엔드 응답(PartialUserProfile)을 프론트 타입(UserData)으로 변환
 */
const transformProfileResponse = (
  data: ProfileUpdateResponse,
  currentUser: UserData | null
): UserData => {
  // Driver 필드 감지
  if (data.nickname !== undefined) {
    const driverProfile: DriverProfileData = {
      driverId: data.id,
      nickname: data.nickname || "",
      oneLiner: data.oneLiner,
      image: data.image ?? null,
      rating: data.rating ?? 0,
      careerYears: data.careerYears ?? "0",
      reviewCount:
        currentUser?.role === "DRIVER" ? ((currentUser.profile as any)?.reviewCount ?? 0) : 0,
      confirmedCount:
        currentUser?.role === "DRIVER" ? ((currentUser.profile as any)?.confirmedCount ?? 0) : 0,
      driverServiceTypes: data.driverServiceTypes as any,
      driverServiceAreas: data.driverServiceAreas as any,
      likes:
        currentUser?.role === "DRIVER"
          ? (currentUser.profile as any)?.likes
          : { likedCount: 0, isLikedByCurrentUser: false },
    };

    return {
      userId: data.id,
      name: data.name,
      role: "DRIVER",
      email: data.email,
      phoneNumber: data.phoneNumber,
      profile: driverProfile,
    };
  }

  // Consumer 필드 감지
  if (data.serviceType !== undefined) {
    const consumerProfile: ConsumerProfileData = {
      consumerId: data.id,
      image: data.image ?? undefined,
      serviceType: data.serviceType as any,
      areas: data.areas as any,
    };

    return {
      userId: data.id,
      name: data.name,
      role: "CONSUMER",
      email: data.email,
      phoneNumber: data.phoneNumber,
      profile: consumerProfile,
    };
  }

  throw new Error("프로필 변환 실패: 유효한 필드가 없습니다");
};

interface UseProfileQueryOptions {
  enabled?: boolean;
}

export const useProfileQuery = (options?: UseProfileQueryOptions) => {
  const queryClient = useQueryClient();
  const { setUser, clearUser } = useUserStore();

  /**
   * 프로필 조회 쿼리
   * GET /users/me
   */
  const profileQuery = useQuery<UserData, Error>({
    queryKey: ["userProfile"],
    queryFn: async () => {
      try {
        const data = await getUserProfile();
        // Zustand store에도 동기화
        setUser(data);
        return data;
      } catch (error) {
        clearUser();
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
    retry: 1,
    enabled: options?.enabled !== false,
  });

  /**
   * 프로필 수정 뮤테이션
   * PATCH /users/me/profile (driverProfile/consumerProfile)
   */
  const updateProfileMutation = useMutation<
    UserData,
    Error,
    UpdateUserProfileRequest,
    { previousData?: UserData }
  >({
    mutationFn: (payload) => updateUserProfile(payload),

    onMutate: async (newData) => {
      // 기존 쿼리 취소
      await queryClient.cancelQueries({ queryKey: ["userProfile"] });

      // 이전 데이터 백업
      const previousData = queryClient.getQueryData<UserData>(["userProfile"]);

      // 낙관적 업데이트
      if (previousData) {
        const optimisticData: UserData = {
          ...previousData,
          ...newData,
        };
        queryClient.setQueryData(["userProfile"], optimisticData);
      }

      return { previousData };
    },

    onError: (_err, _variables, context) => {
      // 실패 시 이전 데이터 복원
      if (context?.previousData) {
        queryClient.setQueryData(["userProfile"], context.previousData);
        setUser(context.previousData);
      }
    },

    onSuccess: (updatedData) => {
      // 성공 시 데이터 업데이트
      queryClient.setQueryData(["userProfile"], updatedData);
      setUser(updatedData);
    },
  });

  /**
   * 기본정보 + 비밀번호 변경 뮤테이션
   * PATCH /users/me/profile (name, phoneNumber, password)
   */
  const updateBasicInfoMutation = useMutation<
    UserData,
    Error,
    UpdateBasicInfoRequest,
    { previousData?: UserData }
  >({
    mutationFn: (payload) => updateBasicInfo(payload),

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["userProfile"] });
      const previousData = queryClient.getQueryData<UserData>(["userProfile"]);
      return { previousData };
    },

    onError: (_err, _variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["userProfile"], context.previousData);
        setUser(context.previousData);
      }
    },

    onSuccess: (updatedData) => {
      queryClient.setQueryData(["userProfile"], updatedData);
      setUser(updatedData);
    },
  });

  return {
    // 조회 상태
    user: profileQuery.data,
    isLoading: profileQuery.isLoading,
    isError: profileQuery.isError,
    error: profileQuery.error,

    // 프로필 수정
    updateProfile: updateProfileMutation.mutateAsync,
    isUpdatingProfile: updateProfileMutation.isPending,
    updateProfileError: updateProfileMutation.error,

    // 기본정보 수정
    updateBasicInfo: updateBasicInfoMutation.mutateAsync,
    isUpdatingBasicInfo: updateBasicInfoMutation.isPending,
    updateBasicInfoError: updateBasicInfoMutation.error,

    // 유틸리티
    refetch: profileQuery.refetch,
    invalidate: () => queryClient.invalidateQueries({ queryKey: ["userProfile"] }),
  };
};
