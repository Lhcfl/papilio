import type { Note } from "misskey-js/entities.js";
import { MkMfm } from "@/components/mk-mfm";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const NoteBodyExpanded = (props: { note: Note }) => {
	return (
		<div className="note-body">
			{props.note.text && <MkMfm text={props.note.text} author={props.note.user} emojiUrls={props.note.emojis} />}
		</div>
	);
};

const NoteBodyCw = (props: { note: Note }) => {
	return (
		<Accordion type="single" collapsible>
			<AccordionItem value="item-1">
				<AccordionTrigger>
					<div className="note-body-cw">
						<MkMfm text={props.note.cw!} author={props.note.user} emojiUrls={props.note.emojis} />
					</div>
				</AccordionTrigger>
				<AccordionContent>
					<NoteBodyExpanded note={props.note} />
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	);
};

export const MkNoteBody = (props: { note: Note }) => {
	const { note } = props;
	return (
		<div className="mk-note-body p-2">{note.cw ? <NoteBodyCw note={note} /> : <NoteBodyExpanded note={note} />}</div>
	);
};
