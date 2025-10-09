import { RepeatIcon } from "lucide-react";
import type { Note } from "misskey-js/entities.js";
import { MkAvatar } from "./mk-avatar";
import { MkUserName } from "./mk-user-name";
import { MkNoteActions } from "./note/mk-note-actions";
import { MkNoteBody } from "./note/mk-note-body";
import { MkNoteHeader } from "./note/mk-note-header";

const MkNoteRenoteTip = (props: { note: Note }) => {
	return (
		<div className="mk-note-renote-tip p-2 flex gap-2 items-center text-muted-foreground">
			<RepeatIcon></RepeatIcon>
			<MkAvatar user={props.note.user} className="size-6" />
			<MkUserName user={props.note.user}></MkUserName>
		</div>
	);
};

export const MkNote = (props: { note: Note }) => {
	const appearNote = props.note.renote ?? props.note;

	return (
		<div className="mk-note flex flex-col p-2">
			{props.note.renote && <MkNoteRenoteTip note={props.note} />}
			<MkNoteHeader note={appearNote} />
			<MkNoteBody note={appearNote} />
			<MkNoteActions note={appearNote} />
		</div>
	);
};
