import { useInfiniteQuery } from "@tanstack/react-query";
import { useMisskeyApi } from "@/services/use-misskey-api";

const TIMELINE_PAGE_SIZE = 30;

export const useHomeTimeline = () => {
  const misskeyApi = useMisskeyApi();
  return useInfiniteQuery({
    queryKey: ["timerline"],
    queryFn: ({ pageParam }) => misskeyApi.request("notes/timeline", {
      limit: TIMELINE_PAGE_SIZE,
      untilId: pageParam,
    }),
    getNextPageParam: (lastPage) => lastPage.at(-1)?.id,
    initialPageParam: "z"
  });
};

export const useGlobalTimeline = () => {
  const misskeyApi = useMisskeyApi();
  return useInfiniteQuery({
    queryKey: ["global-timerline"],
    queryFn: ({ pageParam }) => misskeyApi.request("notes/global-timeline", {
      limit: TIMELINE_PAGE_SIZE,
      untilId: pageParam,
    }),
    getNextPageParam: (lastPage) => lastPage.at(-1)?.id,
    initialPageParam: "z"
  });
};
