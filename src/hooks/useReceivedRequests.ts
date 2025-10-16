import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getReceivedRequests,
  postFilteredRequests,
} from "@/utils/hook/receivedRequest/receivedRequest";
import { ReceivedRequestsResponse, ReceivedRequestFilter } from "@/types/receivedRequest";

export const useReceivedRequests = () =>
  useQuery<ReceivedRequestsResponse>({
    queryKey: ["receivedRequests"],
    queryFn: getReceivedRequests,
  });

export const useFilteredRequests = () =>
  useMutation<ReceivedRequestsResponse, Error, ReceivedRequestFilter>({
    mutationFn: postFilteredRequests,
  });
