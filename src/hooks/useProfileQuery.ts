import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserProfile, updateBasicInfo, getUserProfile } from "@/utils/hook/profile/profile";
import { useUserStore } from "@/store/userStore";
import { useAuthStore } from "@/store/authStore";
import { mapUserDataToAuthUser } from "@/utils/mappers/useMappers";
import { UserData, UpdateUserProfileRequest, UpdateBasicInfoRequest } from "@/types/card";
import { createDriverProfile, CreateDriverProfileRequest } from "@/lib/apis/driverProfileApi";
import { createConsumerProfile, CreateConsumerProfileRequest } from "@/lib/apis/consumerProfileApi";
import { AxiosError } from "axios";

interface UseProfileQueryOptions {
  enabled?: boolean;
}

interface ErrorResponse {
  message?: string;
  error?: string;
}

interface ProfileNotFoundError extends Error {
  _isProfileNotFound?: boolean;
}

export const useProfileQuery = (options?: UseProfileQueryOptions) => {
  const queryClient = useQueryClient();
  const { setUser: setUiUser, clearUser: clearUiUser } = useUserStore();
  const authUser = useAuthStore((s) => s.user);
  const setAuthUser = useAuthStore((s) => s.setUser);

  // 프로필 조회 쿼리
  const profileQuery = useQuery<UserData | null, Error>({
    queryKey: ["userProfile"],
    queryFn: async () => {
      try {
        const data = await getUserProfile();
        setUiUser(data);
        const mapped = mapUserDataToAuthUser(data, authUser);
        setAuthUser(mapped);

        return data;
      } catch (error) {
        // 인터셉터에서 처리한 "프로필 없음" 에러
        const profileError = error as ProfileNotFoundError;
        if (profileError._isProfileNotFound) {
          console.log("[useProfileQuery] 프로필이 아직 등록되지 않았습니다.");
          return null;
        }

        // Axios 에러 처리
        const axiosError = error as AxiosError<ErrorResponse>;
        const status = axiosError.response?.status;
        const responseData = axiosError.response?.data;
        const message = responseData?.message || responseData?.error || "";

        console.log("[useProfileQuery] 에러 상세:", {
          status,
          message,
          responseData,
        });

        // 404는 정상 상황으로 처리
        if (status === 404) {
          console.log("[useProfileQuery] 프로필이 아직 등록되지 않았습니다.");
          return null;
        }

        // 401 (인증 에러)는 로그아웃 처리
        if (status === 401) {
          console.error("[useProfileQuery] 인증 만료 - 로그아웃 처리");
          clearUiUser();
          throw error;
        }

        // 다른 에러는 일단 로그만 남기고 null 반환 (로그아웃 안 함)
        console.error("[useProfileQuery] 프로필 조회 실패:", error);
        return null;
      }
    },
    staleTime: 0,
    refetchOnMount: true,
    retry: false,
    throwOnError: false,

    enabled: !!authUser && authUser.isProfileRegistered !== false,
  });

  // 프로필 수정
  const updateProfileMutation = useMutation<UserData, Error, UpdateUserProfileRequest>({
    mutationFn: (payload) => updateUserProfile(payload),
    onSuccess: (updated) => {
      queryClient.setQueryData(["userProfile"], updated);
      setUiUser(updated);

      const mapped = mapUserDataToAuthUser(updated, authUser);
      setAuthUser(mapped);
    },
    onError: (err) => {
      console.error("[useProfileQuery] updateProfile 실패:", err);
    },
  });

  // 기본정보 수정
  const updateBasicInfoMutation = useMutation<UserData, Error, UpdateBasicInfoRequest>({
    mutationFn: (payload) => updateBasicInfo(payload),
    onSuccess: (updated) => {
      queryClient.setQueryData(["userProfile"], updated);
      setUiUser(updated);

      const mapped = mapUserDataToAuthUser(updated, authUser);
      setAuthUser(mapped);
    },
    onError: (err) => {
      console.error("[useProfileQuery] updateBasicInfo 실패:", err);
    },
  });

  // 기사 프로필 등록
  const createDriverProfileMutation = useMutation({
    mutationFn: (payload: CreateDriverProfileRequest) => createDriverProfile(payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      console.log("[useProfileQuery] 기사 프로필 등록 성공:", response.data);
    },
    onError: (err) => {
      console.error("[useProfileQuery] 기사 프로필 등록 실패:", err);
    },
  });

  // 고객 프로필 등록
  const createConsumerProfileMutation = useMutation({
    mutationFn: (payload: CreateConsumerProfileRequest) => createConsumerProfile(payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      console.log("[useProfileQuery] 고객 프로필 등록 성공:", response.data);
    },
    onError: (err) => {
      console.error("[useProfileQuery] 고객 프로필 등록 실패:", err);
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

    // 기사 프로필 등록
    createDriverProfile: createDriverProfileMutation.mutateAsync,
    isCreatingDriverProfile: createDriverProfileMutation.isPending,
    createDriverProfileError: createDriverProfileMutation.error,

    // 고객 프로필 등록
    createConsumerProfile: createConsumerProfileMutation.mutateAsync,
    isCreatingConsumerProfile: createConsumerProfileMutation.isPending,
    createConsumerProfileError: createConsumerProfileMutation.error,

    // 유틸리티
    refetch: profileQuery.refetch,
    invalidate: () => queryClient.invalidateQueries({ queryKey: ["userProfile"] }),
  };
};
