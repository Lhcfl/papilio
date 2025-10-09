import { HeartIcon, MoreHorizontalIcon, QuoteIcon, RepeatIcon, ReplyIcon, SmileIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";

const MkNoteActionButton = (props: {
	icon: React.ReactNode;
	count?: number;
	loading?: boolean;
	disabled?: boolean;
	className?: string;
	onClick?: () => void;
}) => {
	const { loading, className, icon, count = 0, onClick } = props;
	return (
		<Button
			variant="ghost"
			size={count > 0 ? "default" : "icon"}
			onClick={onClick}
			className={className}
			disabled={props.disabled || props.loading}
		>
			{loading ? <Spinner /> : icon}
			{count > 0 && <span className="ml-1 text-sm">{count}</span>}
		</Button>
	);
};

export const MkNoteActions = (props: { note: NoteWithExtension }) => {
	const { note } = props;

	const isRenoted = note.isRenoted;

	const { mutate: renote, isPending: isRenoting } = useRenoteAction(note.id);
	const { mutate: unrenote, isPending: isUnrenoting } = useUnrenoteAction(note.id);

	return (
		<div className="mk-note-actions p-2">
			<MkNoteActionButton
				icon={<ReplyIcon />}
				count={note.repliesCount}
				disabled={false}
				loading={false}
				onClick={() => console.log("implement reply")}
			/>
			{isRenoted ? (
				<MkNoteActionButton
					className="text-tertiary hover:bg-tertiary/10"
					icon={<RepeatIcon />}
					count={note.renoteCount}
					loading={isUnrenoting}
					onClick={() => unrenote()}
				/>
			) : (
				<MkNoteActionButton
					icon={<RepeatIcon />}
					count={note.renoteCount}
					disabled={note.visibility !== "public" && note.visibility !== "home"}
					loading={isRenoting}
					onClick={() => renote(props.note.visibility as "public" | "home")}
				/>
			)}
			<MkNoteActionButton icon={<QuoteIcon />} onClick={() => console.log("implement quote")} />
			<MkNoteActionButton icon={<HeartIcon />} onClick={() => console.log("implement heart")} />
			<MkNoteActionButton
				count={note.reactionCount}
				icon={<SmileIcon />}
				onClick={() => console.log("implement smile")}
			/>
			<MkNoteActionButton icon={<MoreHorizontalIcon />} onClick={() => console.log("implement more")} />
		</div>
	);
};
