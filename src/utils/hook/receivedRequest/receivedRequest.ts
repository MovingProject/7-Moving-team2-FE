import apiClient from "@/lib/apiClient";
import { ReceivedRequestFilter, ReceivedRequestsResponse } from "@/types/receivedRequest";

export const getReceivedRequests = async (): Promise<ReceivedRequestsResponse> => {
  const res = await apiClient.get("/requests/received");
  return res.data.data;
};

export const postFilteredRequests = async (
  filter: ReceivedRequestFilter
): Promise<ReceivedRequestsResponse> => {
  const res = await apiClient.post("/requests/received/search", filter);
  return res.data.data;
};
