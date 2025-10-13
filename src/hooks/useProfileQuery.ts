import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserProfile, patchUserProfile } from "@/utils/hook/profile/profile";
import { useUserStore } from "@/store/useUserStore";
import { UpdateUserProfileDto, UserProfileResponse } from "@/types/profile";

export const useProfileQuery = () => {
  const queryClient = useQueryClient();
  const { setUser, updateUser } = useUserStore();

  // 프로필 조회
  const { data, isLoading, error } = useQuery<UserProfileResponse>({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const profile = await getUserProfile();
      setUser(profile);
      return profile;
    },
    staleTime: 60 * 1000, // 1분 캐싱
  });

  // 프로필 수정 (PATCH)
  const mutation = useMutation<
    UserProfileResponse, // TData: 성공 시 반환 타입
    unknown, // TError: 에러 타입 (any로 추론 방지)
    UpdateUserProfileDto, // TVariables: mutationFn에 전달하는 변수 타입
    { previousData?: UserProfileResponse } // TContext: onMutate → onError/onSettled로 전달되는 값
  >({
    mutationFn: (payload) => patchUserProfile(payload),

    // 낙관적 업데이트 (Optimistic Update)
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: ["userProfile"] });
      const previousData = queryClient.getQueryData<UserProfileResponse>(["userProfile"]);

      if (previousData) {
        const optimisticData = {
          ...previousData,
          ...newData,
        } as UserProfileResponse;

        queryClient.setQueryData(["userProfile"], optimisticData);
      }

      // context로 전달
      return { previousData };
    },

    // 에러 시 롤백
    onError: (_err, _variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["userProfile"], context.previousData);
      }
    },

    // 성공 시 캐시 및 전역 상태 갱신
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(["userProfile"], updatedProfile);
      updateUser(updatedProfile); // zustand 업데이트
    },

    // 완료 후 무효화
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });

  return {
    data,
    isLoading,
    error,
    updateProfile: mutation.mutateAsync,
  };
};
