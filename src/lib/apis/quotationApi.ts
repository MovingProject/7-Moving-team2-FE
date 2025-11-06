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

export const getConfirmedQuotationCount = async (): Promise<number> => {
  const response = await apiClient.get("/quotations", {
    params: { status: ["CONCLUDED", "COMPLETED"] },
    paramsSerializer: {
      serialize: (params) => {
        const usp = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (Array.isArray(value)) value.forEach((v) => usp.append(key, v));
          else if (value) usp.append(key, String(value));
        });
        return usp.toString();
      },
    },
  });

  const quotations = response.data?.data ?? [];
  return Array.isArray(quotations) ? quotations.length : 0;
};
