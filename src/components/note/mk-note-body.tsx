import type { Note } from "misskey-js/entities.js";

export const MkNoteBody = (props: { note: Note }) => {
	return <div className="mk-note-body p-2">{props.note.text}</div>;
};
