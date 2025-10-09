import type { HTMLAttributes } from "react";

export const MkUrl = (
	props: {
		url: string;
		navigationBehavior?: unknown;
		children?: React.ReactNode;
	} & HTMLAttributes<HTMLAnchorElement>,
) => {
	return (
		<a href={props.url} {...props} className="break-all break-words">
			{props.children || props.url}
		</a>
	);
};
