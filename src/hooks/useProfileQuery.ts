import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserProfile, updateBasicInfo, getUserProfile } from "@/utils/hook/profile/profile";
import { useUserStore } from "@/store/userStore";
import { UserData, UpdateUserProfileRequest, UpdateBasicInfoRequest } from "@/types/card";

interface UseProfileQueryOptions {
  enabled?: boolean;
}

export const useProfileQuery = (options?: UseProfileQueryOptions) => {
  const queryClient = useQueryClient();
  const { setUser, clearUser } = useUserStore();

  // 프로필 조회 쿼리
  const profileQuery = useQuery<UserData, Error>({
    queryKey: ["userProfile"],
    queryFn: async () => {
      try {
        const data = await getUserProfile();
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

  // 프로필 수정
  const updateProfileMutation = useMutation<UserData, Error, UpdateUserProfileRequest>({
    mutationFn: async (payload) => {
      const updated = await updateUserProfile(payload);
      return updated;
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(["userProfile"], updated);
      setUser(updated);
    },
    onError: (error) => {
      console.error("[useProfileQuery] updateProfile 실패:", error);
    },
  });

  // 기본정보 수정
  const updateBasicInfoMutation = useMutation<UserData, Error, UpdateBasicInfoRequest>({
    mutationFn: async (payload) => {
      const updated = await updateBasicInfo(payload);
      return updated;
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(["userProfile"], updated);
      setUser(updated);
    },
    onError: (error) => {
      console.error("[useProfileQuery] updateBasicInfo 실패:", error);
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
