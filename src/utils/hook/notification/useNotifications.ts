import { useInfiniteQuery } from "@tanstack/react-query";
import { getNotifications } from "@/lib/apis/notification";

type NotificationsPage = Awaited<ReturnType<typeof getNotifications>>;

export function useNotifications(options?: { enabled?: boolean }) {
  return useInfiniteQuery<NotificationsPage>({
    queryKey: ["notifications"],
    initialPageParam: undefined as string | undefined,
    queryFn: ({ pageParam }) =>
      getNotifications({ cursor: pageParam as string | undefined, limit: 5 }),
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    enabled: options?.enabled ?? true,
  });
}
