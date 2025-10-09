import { useInfiniteQuery } from "@tanstack/react-query";

const TIMELINE_PAGE_SIZE = 30;

export type TimelineTypes = "home" | "global" | "local" | "hybrid";

export const useTimeline = (type: TimelineTypes) => {
  const api = useMisskeyApi();
  const stream = useMisskeyStream();
  const queryClient = useQueryClient();
  const queryKey = ["timeline", type];

  const channelName = `${type}Timeline` as const;

  useEffect(() => {
    console.log(`subscribing to channel ${channelName}`);
    const channel = stream.useChannel(channelName);
    channel.on("note", (note) => {
      console.log("new note received", note);
      queryClient.setQueryData(queryKey, (data: (typeof query)["data"]) => {
        console.log(data);
        const [page0, ...other] = data?.pages || [[]];
        const newPages = page0.length >= TIMELINE_PAGE_SIZE
          ? [[note], page0]
          : [[note, ...page0]];

        return data ? {
          pageParams: data.pageParams,
          pages: [...newPages, ...other]
        } : data;
      })
    });
    return () => {
      if (import.meta.env.DEV) {
        console.log(`channel ${channelName} disposed`);
      }
      channel.dispose();
    }
  });

  const query = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam }) => {
      switch (type) {
        case "home":
          return api.request("notes/timeline", {
            limit: TIMELINE_PAGE_SIZE,
            untilId: pageParam,
          });
        case "global":
          return api.request("notes/global-timeline", {
            limit: TIMELINE_PAGE_SIZE,
            untilId: pageParam,
          });
        case "local":
          return api.request("notes/local-timeline", {
            limit: TIMELINE_PAGE_SIZE,
            untilId: pageParam,
          });
        case "hybrid":
          return api.request("notes/hybrid-timeline", {
            limit: TIMELINE_PAGE_SIZE,
            untilId: pageParam,
          });
      }
    },
    getNextPageParam: (lastPage) => lastPage.at(-1)?.id,
    initialPageParam: "zzzzzzzzzzzzzzzzzzzzzzzz",
    staleTime: Number.POSITIVE_INFINITY,
  });

  return query;
}

export const useHomeTimeline = () => useTimeline("home");
export const useGlobalTimeline = () => useTimeline("global");
