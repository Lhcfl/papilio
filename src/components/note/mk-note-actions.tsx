import {
	HeartIcon,
	MoreHorizontalIcon,
	QuoteIcon,
	RepeatIcon,
	ReplyIcon,
	SmileIcon,
} from "lucide-react";
import type { Note } from "misskey-js/entities.js";
import { Button } from "../ui/button";

export const MkNoteActions = (props: { note: Note }) => {
	const { note } = props;
	return (
		<div className="mk-note-actions p-2">
			<Button variant="ghost" size={note.repliesCount > 0 ? "default" : "icon"}>
				<ReplyIcon />
				{note.repliesCount > 0 && (
					<span className="ml-1 text-sm">{note.repliesCount}</span>
				)}
			</Button>
			<Button variant="ghost" size={note.renoteCount > 0 ? "default" : "icon"}>
				<RepeatIcon />
				{note.renoteCount > 0 && (
					<span className="ml-1 text-sm">{note.renoteCount}</span>
				)}
			</Button>
			<Button variant="ghost" size="icon">
				<QuoteIcon />
			</Button>
			<Button variant="ghost" size="icon">
				<HeartIcon />
			</Button>
			<Button variant="ghost" size="icon">
				<SmileIcon />
			</Button>
			<Button variant="ghost" size="icon">
				<MoreHorizontalIcon />
			</Button>
		</div>
	);
};
