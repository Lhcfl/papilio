import { useMisskeyApi } from "@/services/use-misskey-api";
import { Spinner } from "./ui/spinner";

export const MkTimerline = () => {
	const misskeyApi = useMisskeyApi();

	const { data, isLoading, isError } = useQuery({
		queryKey: ["mk-timerline"],
		queryFn: () => misskeyApi.request("notes/timeline", {}),
	});

	return (
		<div>
			{isLoading && <Spinner />}
			{isError && <div>Error</div>}
			{data?.map((item) => (
				<div key={item.id}>{item.text}</div>
			))}
		</div>
	);
};
