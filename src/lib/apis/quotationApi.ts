import apiClient from "@/lib/apiClient";

/**
 * 견적 수락 API
 * @param quotationId 견적 ID
 * @returns 수락된 견적 정보
 */
export const acceptQuotation = async (quotationId: string) => {
  const response = await apiClient.post(`/quotations/${quotationId}/accept`);
  return response.data.data;
};
