import { RequestFormData } from "@/types/request";
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
