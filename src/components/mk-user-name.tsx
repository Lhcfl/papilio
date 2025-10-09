import type { User } from "misskey-js/entities.js";
import { MkMfm } from "./mk-mfm";

export const MkUserName = (props: { user: User }) => {
	return (
		<span>
			<MkMfm text={props.user.name || props.user.username} plain></MkMfm>
		</span>
	);
};
