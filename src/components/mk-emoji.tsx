export const MkCustomEmoji = (props: any) => {
	return <span>Emoji</span>;
};

export const MkEmoji = (props: { emoji: string } & any) => {
	return <span>{props.emoji}</span>;
};
