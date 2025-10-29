import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import { RequestCheckResponseDto } from "@/types/request";

interface ActiveRequestResponse {
  pendingRequest?: { id: string };
}

export const useActiveRequestQuery = () => {
  return useQuery({
    queryKey: ["activeRequest"],
    queryFn: async () => {
      const res = await apiClient.get<{ success: boolean; data: RequestCheckResponseDto }>(
        "/requests/check"
      );
      return res.data.data;
    },
  });
};
