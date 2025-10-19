/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { useMemo, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { ChevronDownIcon, ChevronUpIcon, LockIcon, MailIcon, QuoteIcon, ReplyIcon } from 'lucide-react';
import { type MfmNode, parse } from 'mfm-js';
import type { HTMLProps } from 'react';
import { MkMfm } from '@/components/mk-mfm';
import type { NoteWithExtension } from '@/types/note';
import { MkNoteSimple } from '@/components/mk-note-simple';
import { Button } from '@/components/ui/button';
import { MkLinkPreview } from '@/components/note/mk-link-preview';
import { MkNoteFile } from '@/components/note/mk-note-file';
import { MkNoteImages } from '@/components/note/mk-note-images';
import { MkNoteTranslation } from '@/components/note/mk-note-translation';
import { Link } from '@tanstack/react-router';
import { collectAst, countAst } from '@/lib/note';
import { cn, onlyWhenNonInteractableContentClicked } from '@/lib/utils';
import { site } from '@/services/inject-misskey-api';
import { cond } from '@/lib/match';
import { MkMention } from '@/components/mk-mention';
import { acct } from 'misskey-js';
import { MkTime } from '@/components/mk-time';
import { useUsersQuery } from '@/hooks/use-user';

interface NoteBodyCommonProps {
  note: NoteWithExtension;
  showReplyAsIcon?: boolean;
  showQuoteAsIcon?: boolean;
  textAst: MfmNode[];
  disableLinkPreview?: boolean;
  disableRouteOnClick?: boolean;
  detailed?: boolean;
}

const NoteBodyExpanded = (props: NoteBodyCommonProps & HTMLProps<HTMLDivElement>) => {
  const {
    note,
    showQuoteAsIcon,
    showReplyAsIcon,
    disableLinkPreview,
    textAst,
    disableRouteOnClick,
    className,
    ...rest
  } = props;
  const navigate = useNavigate();

  const urls = collectAst(textAst, (x) =>
    x.type === 'url' ? x.props.url : x.type === 'link' ? x.props.url : undefined,
  );

  const images = note.files?.filter((f) => f.type.startsWith('image/') || f.type.startsWith('video/')) ?? [];
  const otherFiles = note.files?.filter((f) => !(f.type.startsWith('image/') || f.type.startsWith('video/'))) ?? [];
  const onContentClick = disableRouteOnClick
    ? undefined
    : onlyWhenNonInteractableContentClicked(() => navigate({ to: '/notes/$id', params: { id: note.id } }));

  return (
    <div className={cn('mk-note-body overflow-hidden', className)} {...rest}>
      {note.text && (
        <div className="note-body-text" onClick={onContentClick}>
          {showReplyAsIcon && note.replyId && (
            <Link className="text-tertiary mr-1 hover:underline" to="/notes/$id" params={{ id: note.replyId }}>
              <ReplyIcon className="size-4 inline" />
            </Link>
          )}
          {showQuoteAsIcon && note.renoteId && (
            <Link className="text-tertiary mr-1 hover:underline" to="/notes/$id" params={{ id: note.renoteId }}>
              <QuoteIcon className="size-4 inline" />
            </Link>
          )}
          <MkMfm
            text={note.text}
            author={note.user}
            emojiUrls={note.emojis}
            parsedNodes={textAst}
            enableEmojiMenu={!disableRouteOnClick}
            enableEmojiMenuReaction={!disableRouteOnClick}
            noteContext={{
              noteId: note.id,
              myReaction: note.myReaction,
            }}
          />
        </div>
      )}
      {note.renoteId && !showQuoteAsIcon && (
        <div className="note-body-quote mt-2 border rounded-md">
          <MkNoteSimple noteId={note.renoteId} />
        </div>
      )}
      <MkNoteTranslation note={note} />
      {images.length > 0 && <MkNoteImages images={images} className="mt-2" />}
      {otherFiles.map((f) => (
        <MkNoteFile className="mt-1" key={f.id} file={f} />
      ))}
      {urls.length > 0 && !disableLinkPreview && (
        <div className="note-body-url-previews">
          {urls.map((u) => (
            <MkLinkPreview className="mt-1" key={u} url={u} />
          ))}
        </div>
      )}
    </div>
  );
};

const NoteBodyCw = (props: NoteBodyCommonProps) => {
  const { t } = useTranslation();
  const { note } = props;

  const [expanded, setExpanded] = useState<null | boolean>(null);

  const details = [
    note.text && t('_cw.chars', { count: note.text.length }),
    note.fileIds && note.fileIds.length > 0 && t('_cw.files', { count: note.fileIds.length }),
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <div className="note-body-with-cw">
      <div className="note-body-cw">
        <MkMfm text={props.note.cw!} author={props.note.user} emojiUrls={props.note.emojis} />
      </div>
      {expanded && <NoteBodyExpanded className="mb-2" {...props} />}
      <div className="sticky bottom-2 w-full text-center">
        <Button
          className="w-full"
          onClick={() => {
            setExpanded(!expanded);
          }}
          variant="secondary"
        >
          {expanded ? (
            <>
              <ChevronUpIcon />
              {t('_cw.hide')}
            </>
          ) : (
            <>
              <ChevronDownIcon />
              {t('_cw.show')} ({details})
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

const NoteBodyLong = (props: NoteBodyCommonProps) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="note-body-long">
      <NoteBodyExpanded
        className={cn({
          'max-h-50 mb-[-2em] overflow-hidden mask-b-from-0': !expanded,
          'mb-2': expanded,
        })}
        {...props}
      />
      <div className="sticky bottom-2 w-full text-center">
        <Button
          onClick={() => {
            setExpanded(!expanded);
          }}
          variant="outline"
        >
          {expanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
          {t(expanded ? 'showLess' : 'showMore')}
        </Button>
      </div>
    </div>
  );
};

export const MkNoteBody = (props: Omit<NoteBodyCommonProps, 'textAst'> & { className?: string }) => {
  const { note, className, detailed, ...rest } = props;
  const { t } = useTranslation();
  const textAst = useMemo(() => parse(note.text ?? ''), [note.text]);
  const { data: visibleUsers } = useUsersQuery(note.visibleUserIds);
  const siteDomain = new URL(site!).host;

  const isHidden = note.isHidden;

  const mentions = collectAst(textAst, (ast) => (ast.type === 'mention' ? ast.props : undefined));
  const extraVisibleUsers = (visibleUsers ?? []).filter((u) =>
    mentions.every(
      (m) =>
        acct.toString(u) != acct.toString(m) &&
        acct.toString({
          username: u.username,
          host: u.host ?? siteDomain,
        }) != acct.toString(m),
    ),
  );

  const invisibleMentions = mentions.filter((m) =>
    visibleUsers?.every(
      (u) =>
        acct.toString(u) != acct.toString(m) &&
        acct.toString({
          username: u.username,
          host: u.host ?? siteDomain,
        }) != acct.toString(m),
    ),
  );

  const isLong =
    (note.text?.length ?? 0) > 400 ||
    (note.text?.split('\n').length ?? 0) > 15 ||
    (note.fileIds?.length ?? 0) >= 5 ||
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

  return (
    <div className={cn('mk-note-body p-2 text-[0.95em] md:text-base', className)}>
      {note.visibility == 'specified' && (extraVisibleUsers.length > 0 || invisibleMentions.length > 0) && (
        <div className="text-sm text-muted-foreground px-2 pb-2 mb-2 flex items-center flex-wrap gap-1 border-b">
          <MailIcon className="size-3" />
          {t('recipient')}:
          {visibleUsers?.map((u) => (
            <MkMention key={u.id} username={u.username} host={u.host} />
          ))}
        </div>
      )}
      {cond([
        [
          isHidden,
          <div key="private" className="flex gap-2 text-muted-foreground items-center">
            <LockIcon className="size-4" />
            {t('private')}
          </div>,
        ],
        [note.cw != null, <NoteBodyCw key="cw" note={note} textAst={textAst} {...rest} />],
        [!detailed && isLong, <NoteBodyLong key="long" note={note} textAst={textAst} {...rest} />],
        [true, <NoteBodyExpanded key="default" note={note} textAst={textAst} {...rest} />],
      ])}
      {detailed && (
        <div className="note-time mt-4 text-sm text-muted-foreground">
          <p>
            {t('createdAt')}: <MkTime mode="detail" time={note.createdAt} />
          </p>
          {note.updatedAt && note.updatedAt !== note.createdAt && (
            <p>
              {t('updatedAt')}: <MkTime mode="detail" time={note.updatedAt} />
            </p>
          )}
        </div>
      )}
    </div>
  );
};
