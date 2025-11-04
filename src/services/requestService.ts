import { RequestFormData, RequestDetail } from "@/types/request";
import api from "@/lib/apiClient";

export const submitRequest = async (data: RequestFormData): Promise<void> => {
  try {
    const response = await api.post("/requests", data);

    console.log("견적 요청 서버 응답:", response.data);
  } catch (error) {
    console.error("견적 요청 제출 실패:", error);
    throw error;
  }
};

/**
 * 견적 요청서 상세 조회
 * @param requestId - 견적 요청서 ID
 * @returns RequestDetail - 견적 요청서 상세 정보
 */
export const getRequestById = async (requestId: string): Promise<RequestDetail> => {
  const response = await api.get(`/requests/${requestId}`);
  // 백엔드 응답: { success: true, data: {...} }
  if (response.data.success && response.data.data) {
    return response.data.data;
  }
  throw new Error("견적 요청서 데이터가 없습니다.");
};
