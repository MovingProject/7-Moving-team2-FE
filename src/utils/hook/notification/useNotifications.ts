import { useInfiniteQuery } from "@tanstack/react-query";
import { getNotifications, GetNotificationsResponse } from "@/lib/apis/notification";

export function useNotifications(options?: { enabled?: boolean }) {
  return useInfiniteQuery<GetNotificationsResponse>({
    queryKey: ["notifications"],
    queryFn: ({ pageParam }) =>
      getNotifications({ cursor: pageParam as string | undefined, limit: 5 }),
    initialPageParam: null,
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? (lastPage.nextCursor ?? undefined) : undefined,
    enabled: options?.enabled ?? true,
  });
}
