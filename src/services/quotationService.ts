import { CustomerAllRequestsResponse } from "@/types/quotation";
import api from "@/lib/apiClient";

interface ApiResponseWrapper<T> {
  success: boolean;
  data: T;
}

export const getCustomerReceivedQuotationList = async (): Promise<CustomerAllRequestsResponse> => {
  try {
    const response =
      await api.get<ApiResponseWrapper<CustomerAllRequestsResponse>>("/requests/list");

    console.log("고객 받은 견적 전체 목록 서버 응답:", response.data);
    return response.data.data;
  } catch (error) {
    console.error("고객 받은 견적 목록을 불러오는 데 실패했습니다:", error);
    throw error;
  }
};
