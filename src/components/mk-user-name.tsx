import type { User } from "misskey-js/entities.js";
import type { HTMLProps } from "react";
import { MkMfm } from "./mk-mfm";

export const MkUserName = (props: { user: User } & HTMLProps<HTMLSpanElement>) => {
	const { user, ...rest } = props;
	return (
		<span {...rest}>
			<MkMfm text={user.name || user.username} emojiUrls={user.emojis} author={user} plain></MkMfm>
		</span>
	);
};
