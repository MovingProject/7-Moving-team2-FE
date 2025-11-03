import apiClient from "@/lib/apiClient";

/**
 * 요청 반려 API
 * @param requestId - 반려할 요청 ID (UUID)
 * @param note - 선택적인 반려 사유
 */
export const rejectRequest = async (requestId: string, note?: string) => {
  const response = await apiClient.post("/requests/reject", {
    requestId,
    note,
  });
  return response.data;
};
