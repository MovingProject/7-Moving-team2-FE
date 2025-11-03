import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/apiClient";
import { ApiResponseWrapper, DriverQuotationListResponse } from "@/types/quotation";
import { useAuthStore } from "@/store/authStore";

interface ApiErrorData {
  message: string;
}

export const useDriverQuotationList = () => {
  const { user } = useAuthStore();
  const userId = user?.id;

  return useQuery<DriverQuotationListResponse, AxiosError<ApiErrorData>>({
    queryKey: ["driverQuotationList", userId],

    queryFn: async () => {
      try {
        const res = await api.get<ApiResponseWrapper<DriverQuotationListResponse>>("/quotations");
        return res.data.data;
      } catch (err) {
        const error = err as AxiosError<ApiErrorData>;
        const status = error.response?.status;
        const message = error.response?.data?.message;

        if (status === 404 && message === "보낸 견적서가 없습니다.") {
          return [];
        }

        throw error;
      }
    },

    enabled: !!userId && user?.role === "DRIVER",
  });
};
