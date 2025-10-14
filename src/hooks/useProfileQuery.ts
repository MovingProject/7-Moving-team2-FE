import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserProfile, patchUserProfile } from "@/utils/hook/profile/profile";
import { useUserStore } from "@/store/userStore";
import { UpdateUserProfileDto } from "@/types/profile";
import { UserData } from "@/types/card";

export const useProfileQuery = () => {
  const queryClient = useQueryClient();
  const { setUser } = useUserStore();

  // 프로필 조회
  const { data, isLoading, error } = useQuery<UserData>({
    queryKey: ["userProfile"],
    queryFn: async () => {
      // 백엔드 응답은 아직 profile이 분리된 형태라고 가정
      const raw = await getUserProfile();

      // role 기반 type narrowing
      if (raw.role === "DRIVER") {
        const mappedUser: UserData = {
          userId: raw.userId,
          name: raw.name,
          email: raw.email,
          phoneNumber: raw.phoneNumber,
          role: "DRIVER",
          profile: raw.profile ?? null,
        };
        setUser(mappedUser);
        return mappedUser;
      } else {
        const mappedUser: UserData = {
          userId: raw.userId,
          name: raw.name,
          email: raw.email,
          phoneNumber: raw.phoneNumber,
          role: "CONSUMER",
          profile: raw.profile ?? null,
        };
        setUser(mappedUser);
        return mappedUser;
      }
    },
    staleTime: 60 * 1000,
  });

  // 프로필 수정
  const mutation = useMutation<
    UserData,
    unknown,
    UpdateUserProfileDto,
    { previousData?: UserData }
  >({
    mutationFn: (payload) => patchUserProfile(payload),

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["userProfile"] });
      const previousData = queryClient.getQueryData<UserData>(["userProfile"]);
      return { previousData };
    },

    onError: (_err, _variables, context) => {
      if (context?.previousData) queryClient.setQueryData(["userProfile"], context.previousData);
    },

    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(["userProfile"], updatedProfile);
      setUser(updatedProfile);
    },

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
