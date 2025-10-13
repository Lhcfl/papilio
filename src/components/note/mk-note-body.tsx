import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { ChevronDownIcon, ChevronUpIcon, QuoteIcon, ReplyIcon } from 'lucide-react';
import { type MfmNode, parse } from 'mfm-js';
import type { HTMLProps } from 'react';
import { MkMfm } from '@/components/mk-mfm';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { NoteWithExtension } from '@/types/note';
import { MkNoteSimple } from '../mk-note-simple';
import { Button } from '../ui/button';
import { MkLinkPreview } from './mk-link-preview';
import { MkNoteFile } from './mk-note-file';
import { MkNoteImages } from './mk-note-images';
import { MkNoteTranslation } from './mk-note-translation';
import { Link } from '@tanstack/react-router';
import { useNoteValue } from '@/hooks/use-note';
import { collectAst, countAst, getNoteRoute } from '@/lib/note';
import { onlyWhenNonInteractableContentClicked } from '@/lib/utils';

type NoteBodyCommonProps = {
  note: NoteWithExtension;
  showReplyAsIcon?: boolean;
  showQuoteAsIcon?: boolean;
  textAst: MfmNode[];
  disableLinkPreview?: boolean;
};

const NoteBodyExpanded = (props: NoteBodyCommonProps & HTMLProps<HTMLDivElement>) => {
  const { note, showQuoteAsIcon, showReplyAsIcon, disableLinkPreview, textAst, ...rest } = props;
  const navigate = useNavigate();

  const quote = useNoteValue(showQuoteAsIcon ? null : note.renoteId);

  const urls = collectAst(textAst, (x) =>
    x.type === 'url' ? x.props.url : x.type === 'link' ? x.props.url : undefined,
  );

  const images = note.files?.filter((f) => f.type.startsWith('image/')) || [];
  const otherFiles = note.files?.filter((f) => !f.type.startsWith('image/')) || [];

  return (
    <div className="note-body" {...rest}>
      {note.text && (
        <div
          className="note-body-text"
          onClick={onlyWhenNonInteractableContentClicked(() => navigate({ to: getNoteRoute(note.id) }))}
        >
          {showReplyAsIcon && note.replyId && (
            <Link className="text-tertiary mr-1 hover:underline" to={getNoteRoute(note.replyId)}>
              <ReplyIcon className="size-4 inline" />
            </Link>
          )}
          {showQuoteAsIcon && note.renoteId && (
            <Link className="text-tertiary mr-1 hover:underline" to={getNoteRoute(note.renoteId)}>
              <QuoteIcon className="size-4 inline" />
            </Link>
          )}
          <MkMfm text={note.text} author={note.user} emojiUrls={note.emojis} parsedNodes={textAst} />
        </div>
      )}
      {quote && !showQuoteAsIcon && (
        <div className="note-body-quote mt-2 border rounded-md">
          <MkNoteSimple note={quote} />
        </div>
      )}
      <MkNoteTranslation note={note} />
      {urls.length > 0 && !disableLinkPreview && (
        <div className="note-body-url-previews">
          {urls.map((u) => (
            <MkLinkPreview className="mt-1" key={u} url={u} />
          ))}
        </div>
      )}
      {images.length > 0 && <MkNoteImages images={images} className="mt-2" />}
      {otherFiles.map((f) => (
        <MkNoteFile className="mt-1" key={f.id} file={f} />
      ))}
    </div>
  );
};

const NoteBodyCw = (props: NoteBodyCommonProps) => {
  const { t } = useTranslation();
  const { note } = props;

  const details = [
    note.text && t('_cw.chars', { count: note.text.length }),
    note.fileIds && note.fileIds.length > 0 && t('_cw.files', { count: note.fileIds.length }),
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger className="text-base">
          <div className="note-body-cw">
            <MkMfm text={props.note.cw!} author={props.note.user} emojiUrls={props.note.emojis} />
            <div className="note-info">
              <span className="text-muted-foreground text-sm">
                {t('_cw.show')} ({details})
              </span>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="text-base">
          <NoteBodyExpanded {...props} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

const NoteBodyLong = (props: NoteBodyCommonProps) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="note-body-long">
      <NoteBodyExpanded
        className={clsx({
          'max-h-50 mb-[-2em] overflow-hidden mask-b-from-0': !expanded,
          'mb-2': expanded,
        })}
        {...props}
      />
      <div className="sticky bottom-2 w-full text-center">
        <Button onClick={() => setExpanded(!expanded)} variant="outline">
          {expanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
          {t(expanded ? 'showLess' : 'showMore')}
        </Button>
      </div>
    </div>
  );
};

export const MkNoteBody = (props: Omit<NoteBodyCommonProps, 'textAst'> & { className?: string }) => {
  const { note, className, ...rest } = props;

  const cls = clsx('mk-note-body p-2', className);

  const textAst = parse(note.text || '');

  const isLong =
    (note.text?.length || 0) > 400 ||
    (note.text?.split('\n').length || 0) > 15 ||
    (note.fileIds?.length || 0) >= 5 ||
    countAst(textAst, (ast) => {
      switch (ast.type) {
        case 'url':
          return 2;
        case 'link':
          return 2;
        case 'fn': {
          if (ast.props.name == 'x2') return 3;
          if (ast.props.name == 'x3') return 5;
          if (ast.props.name == 'x4') return 9;
        }
      }
      return 0;
    }) >= 10;

  if (note.cw) {
    return (
      <div className={cls}>
        <NoteBodyCw note={note} textAst={textAst} {...rest} />
      </div>
    );
  }
  if (isLong) {
    return (
      <div className={cls}>
        <NoteBodyLong note={note} textAst={textAst} {...rest} />
      </div>
    );
  }
  return (
    <div className={cls}>
      <NoteBodyExpanded note={note} textAst={textAst} {...rest} />
    </div>
  );
};
