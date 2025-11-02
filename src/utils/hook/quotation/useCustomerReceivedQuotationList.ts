import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/apiClient";
import { CustomerAllRequestsResponse, ApiResponseWrapper } from "@/types/quotation"; // 정의된 타입 사용
import { useAuthStore } from "@/store/authStore";

interface ApiErrorData {
  message: string;
}

export const useCustomerReceivedQuotationList = () => {
  const { user } = useAuthStore();
  const userId = user?.id;

  return useQuery({
    // 쿼리 키: 데이터의 고유 식별자 및 userId를 포함
    queryKey: ["customerReceivedQuotations", userId],

    // 쿼리 함수: 실제 API 호출 로직
    queryFn: async () => {
      try {
        const res =
          await api.get<ApiResponseWrapper<CustomerAllRequestsResponse>>("/requests/list");
        return res.data.data;
      } catch (err) {
        const error = err as AxiosError<ApiErrorData>;
        const status = error.response?.status;
        const message = error.response?.data?.message;

        if (status === 404 && message === "조회 가능한 요청이 없습니다.") {
          // 데이터 없음은 빈 배열로 처리하여 정상 반환 (쿼리 성공으로 간주)
          return [];
        } // 그 외의 에러는 throw
        throw error;
      }
    },

    // 쿼리 옵션: userId가 유효하고, 역할이 CONSUMER일 때만 쿼리를 실행
    enabled: !!userId && user?.role === "CONSUMER",
  });
};
