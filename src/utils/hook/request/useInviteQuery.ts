import { useMutation } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";

interface InviteResult {
  invited: boolean;
  alreadyExisted: boolean;
}

/** 기사 지정 견적 요청 */
export const postInviteDriver = async (driverId: string): Promise<InviteResult> => {
  const res = await apiClient.post<{ success: boolean; data: InviteResult }>(
    `/requests/invite/${driverId}`
  );
  return res.data.data;
};

export const useInviteDriver = () => {
  return useMutation({
    mutationFn: (driverId: string) => postInviteDriver(driverId),
  });
};
