import type { Note } from "misskey-js/entities.js";
import { MkMfm } from "../mk-mfm";

export const MkNoteBody = (props: { note: Note }) => {
	return (
		<div className="mk-note-body p-2">
			{props.note.text && <MkMfm text={props.note.text} />}
		</div>
	);
};
