import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserProfile, updateBasicInfo, getUserProfile } from "@/utils/hook/profile/profile";
import { useUserStore } from "@/store/userStore";
import { useAuthStore } from "@/store/authStore";
import { mapUserDataToAuthUser } from "@/utils/mappers/useMappers";
import { UserData, UpdateUserProfileRequest, UpdateBasicInfoRequest } from "@/types/card";

interface UseProfileQueryOptions {
  enabled?: boolean;
}

export const useProfileQuery = (options?: UseProfileQueryOptions) => {
  const queryClient = useQueryClient();
  const { setUser: setUiUser, clearUser: clearUiUser } = useUserStore();
  const authUser = useAuthStore((s) => s.user);
  const setAuthUser = useAuthStore((s) => s.setUser);

  // 프로필 조회 쿼리
  const profileQuery = useQuery<UserData, Error>({
    queryKey: ["userProfile"],
    queryFn: async () => {
      try {
        const data = await getUserProfile();
        setUiUser(data);
        const mapped = mapUserDataToAuthUser(data, authUser);
        setAuthUser(mapped);

        return data;
      } catch (error) {
        clearUiUser();
        throw error;
      }
    },
    staleTime: 0, // 캐시된 데이터 바로 무효화
    refetchOnMount: true, // 마운트 시 무조건 새로 요청
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
