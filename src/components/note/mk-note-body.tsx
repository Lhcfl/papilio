import clsx from "clsx";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import type { Note } from "misskey-js/entities.js";
import type { HTMLProps } from "react";
import { MkMfm } from "@/components/mk-mfm";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "../ui/button";

const NoteBodyExpanded = (props: { note: Note } & HTMLProps<HTMLDivElement>) => {
	const { note, ...rest } = props;
	return (
		<div className="note-body" {...rest}>
			{note.text && <MkMfm text={note.text} author={note.user} emojiUrls={note.emojis} />}
		</div>
	);
};

const NoteBodyCw = (props: { note: Note }) => {
	const { t } = useTranslation();
	const { note } = props;

	const details = [
		note.text && t("_cw.chars", { count: note.text.length }),
		note.fileIds && note.fileIds.length > 0 && t("_cw.files", { count: note.fileIds.length }),
	]
		.filter(Boolean)
		.join(", ");

	return (
		<Accordion type="single" collapsible>
			<AccordionItem value="item-1">
				<AccordionTrigger className="text-base">
					<div className="note-body-cw">
						<MkMfm text={props.note.cw!} author={props.note.user} emojiUrls={props.note.emojis} />
						<div className="note-info">
							<span className="text-muted-foreground text-sm">
								{t("_cw.show")} ({details})
							</span>
						</div>
					</div>
				</AccordionTrigger>
				<AccordionContent className="text-base">
					<NoteBodyExpanded note={props.note} />
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	);
};

const NoteBodyLong = (props: { note: Note }) => {
	const { t } = useTranslation();
	const [expanded, setExpanded] = useState(false);
	return (
		<div className="note-body-long">
			<NoteBodyExpanded
				note={props.note}
				className={clsx({ "max-h-50 mb-[-2em] overflow-hidden mask-b-from-0": !expanded })}
			/>
			<div className="sticky bottom-2 w-full text-center">
				<Button onClick={() => setExpanded(!expanded)} variant="outline">
					{expanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
					{t(expanded ? "showLess" : "showMore")}
				</Button>
			</div>
		</div>
	);
};

export const MkNoteBody = (props: { note: Note }) => {
	const { note } = props;

	const isLong = (note.text?.length || 0) + (note.fileIds?.length || 0) * 100 > 500;

	if (note.cw) {
		return (
			<div className="mk-note-body p-2">
				<NoteBodyCw note={note} />
			</div>
		);
	}
	if (isLong) {
		return (
			<div className="mk-note-body p-2">
				<NoteBodyLong note={note} />
			</div>
		);
	}
	return (
		<div className="mk-note-body p-2">
			<NoteBodyExpanded note={note} />
		</div>
	);
};
