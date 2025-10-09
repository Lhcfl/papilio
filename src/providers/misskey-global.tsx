import { CircleXIcon } from "lucide-react";
import type { EmojisResponse } from "misskey-js/entities.js";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";
import { MisskeyGlobalContext } from "@/hooks/use-misskey-global";
import { getUserSite, useMisskeyApi } from "@/services/use-misskey-api";

export const MisskeyGlobalProvider = (props: { children: React.ReactNode }) => {
	const api = useMisskeyApi();
	const site = getUserSite();
	const { t } = useTranslation();

	const emojisQuery = useQuery({
		queryKey: ["custom-emojis"],
		refetchInterval: 1000 * 60 * 60, // 1 hours
		queryFn: () =>
			fetch(new URL("/api/emojis", api.origin)).then((r) =>
				r.json(),
			) as Promise<EmojisResponse>,
	});

	const metaQuery = useQuery({
		queryKey: ["site-info"],
		queryFn: () => api.request("meta", {}),
	});

	const queries = [
		["Loading emoji", emojisQuery],
		["Loading site info", metaQuery],
	] as const;

	if (queries.some(([, q]) => q.isError)) {
		return (
			<div className="w-screen h-screen flex items-center justify-center">
				<Empty>
					<EmptyHeader>
						<EmptyMedia variant="icon">
							<CircleXIcon></CircleXIcon>
						</EmptyMedia>
						<EmptyTitle>{t("error")}</EmptyTitle>
						<EmptyDescription>
							<ul>
								{queries.map(
									([name, query]) =>
										query.error && (
											<li>
												<b>{name}: </b>
												<span>{query.error?.message}</span>
											</li>
										),
								)}
							</ul>
						</EmptyDescription>
					</EmptyHeader>
					<EmptyContent>
						<Button onClick={() => window.location.reload()}>
							{t("reload")}
						</Button>
					</EmptyContent>
				</Empty>
			</div>
		);
	}

	if (queries.some(([, q]) => !q.data)) {
		return (
			<div className="w-screen h-screen flex items-center justify-center">
				<Spinner />
			</div>
		);
	}

	const emojis = emojisQuery.data!.emojis;
	const emojisMap = new Map(emojis.map((e) => [e.name, e]));

	// all loaded
	return (
		<MisskeyGlobalContext.Provider
			value={{
				site,
				emojis,
				emojisMap,
				meta: metaQuery.data!,
			}}
		>
			{props.children}
		</MisskeyGlobalContext.Provider>
	);
};
