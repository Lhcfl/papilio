import { Link } from "@tanstack/react-router";
import { acct } from "misskey-js";
import type { HTMLAttributes } from "react";

export const MkMention = (
	props: {
		username: string;
		host: string | null;
		noNavigate?: boolean;
	} & HTMLAttributes<HTMLSpanElement>,
) => {
	const { username, host, noNavigate, ...rest } = props;

	return (
		<span {...rest}>
			{noNavigate ? (
				<span {...rest}>
					@{username}
					{host && <>@{host}</>}
				</span>
			) : (
				<Link to={`/@${acct.toString({ username, host })}` as never} {...rest}>
					@{username}
					{host && <>@{host}</>}
				</Link>
			)}
		</span>
	);
};
