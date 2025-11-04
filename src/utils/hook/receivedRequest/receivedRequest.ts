import apiClient from "@/lib/apiClient";
import { ReceivedRequestFilter, ReceivedRequestsResponse } from "@/types/receivedRequest";

export const getReceivedRequests = async (): Promise<ReceivedRequestsResponse> => {
  try {
    const res = await apiClient.get("/requests/received");
    return res.data.data;
  } catch (error: unknown) {
    // 404 에러이고 "결과값이 비어있습니다" 메시지인 경우 빈 배열 반환
    const err = error as { response?: { status?: number } };
    if (err?.response?.status === 404) {
      console.log("받은 견적 요청이 없습니다. 빈 배열 반환");
      return [];
    }
    throw error;
  }
};

export const postFilteredRequests = async (
  filter: ReceivedRequestFilter
): Promise<ReceivedRequestsResponse> => {
  try {
    const res = await apiClient.post("/requests/received/search", filter);
    return res.data.data;
  } catch (error: unknown) {
    // 404 에러이고 "결과값이 비어있습니다" 메시지인 경우 빈 배열 반환
    const err = error as { response?: { status?: number } };
    if (err?.response?.status === 404) {
      console.log("필터 조건에 맞는 견적 요청이 없습니다. 빈 배열 반환");
      return [];
    }
    throw error;
  }
};
