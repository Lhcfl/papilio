import { getDraftKey, useDraft, type DraftData, type DraftKeyProps } from '@/hooks/use-draft';
import { Skeleton } from './ui/skeleton';
import { InputGroup, InputGroupAddon, InputGroupTextarea } from './ui/input-group';
import { useTranslation } from 'react-i18next';
import { MkAvatar } from './mk-avatar';
import { useMe } from '@/stores/me';
import { Button } from './ui/button';
import {
  ChartColumnIcon,
  EyeIcon,
  ImageIcon,
  MailIcon,
  MailWarningIcon,
  MessageSquareWarningIcon,
  MoreHorizontalIcon,
  PencilIcon,
  QuoteIcon,
  ReplyIcon,
  SendIcon,
  SmilePlusIcon,
  XIcon,
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { MkMfm } from './mk-mfm';
import { cn, withDefer } from '@/lib/utils';
import { MkUserName } from './mk-user-name';
import { MkEmojiPickerPopup } from './mk-emoji-picker-popup';
import type { EmojiSimple, User } from 'misskey-js/entities.js';
import { useEffect, useRef, useState, type HTMLProps } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { injectCurrentSite, misskeyApi } from '@/services/inject-misskey-api';
import { Spinner } from './ui/spinner';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import type { NoteWithExtension } from '@/types/note';
import { cond } from '@/lib/match';
import * as mfm from 'mfm-js';
import { acct } from 'misskey-js';
import { collectAst } from '@/lib/note';
import { MkMention } from './mk-mention';
import { getAcctUserQueryOptions } from '@/hooks/use-user';
import { MkVisibilityPicker } from './post-form/mk-visibility-picker';
import { useMount } from 'react-use';

function extractMention(note: NoteWithExtension | undefined, me: { username: string; host: string | null }) {
  if (!note) return '';
  const mentions = [`@${acct.toString(note.user)}`];
  if (note.text) {
    const ast = mfm.parse(note.text);
    mentions.push(
      ...collectAst(ast, (node) => (node.type === 'mention' ? `@${acct.toString(node.props)}` : undefined)),
    );
  }
  const res = new Set(mentions);
  res.delete(`@${acct.toString(me)}`);
  res.delete(`@${me.username}`);
  return [...res, ''].join(' ');
}

type MkPostFormProps = DraftKeyProps & {
  onSuccess?: () => void;
  autoFocus?: boolean;
  visibilityRestrict?: DraftData['visibility'][];
  relatedNote?: NoteWithExtension;
  prependHeader?: React.ReactNode;
  appendHeader?: React.ReactNode;
  prependFooter?: React.ReactNode;
  appendFooter?: React.ReactNode;
} & HTMLProps<HTMLDivElement>;

export const MkPostForm = (props: MkPostFormProps) => {
  const me = useMe();
  const { replyId, editId, quoteId, visibilityRestrict, relatedNote } = props;

  const draftKey = getDraftKey({ replyId, editId, quoteId });

  const draft = useDraft(draftKey, {
    visibility: visibilityRestrict?.at(0),
    localOnly: relatedNote?.localOnly,
    cw:
      cond([
        [editId != null, relatedNote?.cw],
        [replyId != null, relatedNote?.cw],
        [true, null],
      ]) ?? undefined,
    text:
      cond([
        [editId != null, relatedNote?.text],
        [replyId != null, extractMention(relatedNote, me)],
        [true, null],
      ]) ?? undefined,
  });

  if (draft == null) return <MkPostFormSkeleton />;
  return <MkPostFormLoaded {...props} draft={draft} draftKey={draftKey} />;
};

const MkPostFormLoaded = (
  props: MkPostFormProps & {
    draftKey: string;
    draft: NonNullable<ReturnType<typeof useDraft>>;
  },
) => {
  const {
    replyId,
    editId,
    quoteId,
    onSuccess,
    autoFocus,
    draftKey,
    draft,
    relatedNote,
    visibilityRestrict,
    prependHeader,
    appendHeader,
    prependFooter,
    appendFooter,
    className,
    ...rest
  } = props;

  const site = injectCurrentSite();
  const siteDomain = new URL(site).hostname;
  const { t } = useTranslation();
  const me = useMe();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const cwRef = useRef<HTMLTextAreaElement>(null);
  const [currentFocusTextarea, setCurrentFocusTextarea] = useState<'text' | 'cw'>('text');
  const placeholder = t('_postForm._placeholders.f');
  const queryClient = useQueryClient();

  useEffect(() => {
    if (draft.visibility == 'specified' && unspecifiedMentions.length > 0) {
      addUnspecifiedMentionUser();
    }
    // we only want to run this when visibility changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft.visibility]);

  useMount(() => {
    const textarea = textareaRef.current;
    if (textarea && autoFocus) {
      textarea.focus();
    }
    textarea?.setSelectionRange(draft.text.length, draft.text.length);
  });

  const parsedText = mfm.parse(draft.text);
  const mentionedUsers = collectAst(parsedText, (node) => (node.type === 'mention' ? node.props : undefined));
  const unspecifiedMentions = mentionedUsers.filter((u) =>
    draft.visibleUsers.every((vu) => u.username != vu.username || (u.host != siteDomain && u.host != vu.host)),
  );

  const { mutate: addUnspecifiedMentionUser, isPending: isAddingUser } = useMutation({
    mutationKey: ['add-unspecified-mention-user', draftKey],
    mutationFn: () =>
      Promise.allSettled(unspecifiedMentions.map((u) => queryClient.ensureQueryData(getAcctUserQueryOptions(u)))),
    onSuccess: (users) => {
      const dedumplicater = new Map<string, User>(draft.visibleUsers.map((u) => [u.id, u]));
      for (const u of users) {
        if (u.status == 'fulfilled') {
          dedumplicater.set(u.value.id, u.value);
        }
      }
      draft.update({ visibleUsers: [...dedumplicater.values()] });
    },
  });

  const { mutate: send, isPending: isSending } = useMutation({
    mutationKey: ['post', draftKey],
    mutationFn: (data: DraftData) =>
      editId
        ? (misskeyApi('notes/edit', {
            editId,
            cw: data.hasCw ? data.cw : undefined,
            text: data.text,
            fileIds: data.files.length > 0 ? data.files.map((f) => f.id) : undefined,
          }) as Promise<unknown>)
        : misskeyApi('notes/create', {
            visibility: data.visibility,
            visibleUserIds: data.visibility === 'specified' ? data.visibleUsers.map((u) => u.id) : undefined,
            cw: data.hasCw ? data.cw : undefined,
            localOnly: data.localOnly,
            reactionAcceptance: data.reactionAcceptance,
            replyId,
            renoteId: quoteId,
            // TODO
            channelId: undefined,
            text: data.text,
            fileIds: data.files.length > 0 ? data.files.map((f) => f.id) : undefined,
            poll: data.poll,
          }),
    onSuccess: () => {
      onSuccess?.();
      if (props.editId || props.quoteId || props.replyId) {
        draft.remove();
      } else {
        draft.resetExcept(['visibility', 'cw', 'hasCw', 'showPreview', 'reactionAcceptance']);
      }
    },
  });

  const sendable = [draft.text.trim().length > 0, draft.hasCw && draft.cw.trim().length > 0].some((v) => v);

  function onEmojiChoose(emoji: string | EmojiSimple) {
    const textarea = currentFocusTextarea === 'cw' ? cwRef.current : textareaRef.current;
    if (!textarea) return;
    const selectionSt = textarea.selectionStart;
    const st = draft[currentFocusTextarea].slice(0, selectionSt);
    const ed = draft[currentFocusTextarea].slice(textarea.selectionEnd);
    const emojiCode = typeof emoji == 'string' ? emoji : `:${emoji.name}:`;
    draft.update({ [currentFocusTextarea]: st + emojiCode + ed });
    setTimeout(() => {
      textarea.setSelectionRange(selectionSt + emojiCode.length, selectionSt + emojiCode.length);
    }, 0);
  }

  const PostBtnIcon = props.replyId ? ReplyIcon : props.quoteId ? QuoteIcon : props.editId ? PencilIcon : SendIcon;
  const postBtnLabel = props.replyId ? t('reply') : props.quoteId ? t('quote') : props.editId ? t('edit') : t('note');

  return (
    <div className={cn('mk-post-form rounded-md @container', className)} {...rest}>
      <div className="mk-post-form__title p-2 border-b flex items-center justify-between">
        <div className="flex items-center">
          <MkAvatar user={me} />
          {prependHeader}
        </div>
        <div className="mk-post-form__control flex items-center">
          <MkVisibilityPicker
            visibility={draft.visibility}
            forceLocalOnly={relatedNote?.localOnly}
            localOnly={draft.localOnly}
            setLocalOnly={(v) => {
              draft.update({ localOnly: v });
            }}
            setVisibility={(v) => {
              draft.update({ visibility: v });
            }}
            visibilityRestrict={visibilityRestrict}
            disabled={!!editId}
          />
          {appendHeader}
        </div>
      </div>
      {draft.hasCw && (
        <div className="w-full">
          <InputGroup className="rounded-none shadow-none border-none">
            <InputGroupAddon align="block-start" className="-mb-4 p-2">
              <span className="text-xs text-muted-foreground">{t('cw')}</span>
            </InputGroupAddon>
            <InputGroupTextarea
              className="min-h-2 @max-sm:text-sm"
              ref={cwRef}
              name="text"
              value={draft.cw}
              onChange={(e) => {
                draft.update({ cw: e.target.value });
              }}
              onFocus={() => {
                setCurrentFocusTextarea('cw');
              }}
            />
          </InputGroup>
          <div className="border-b" />
        </div>
      )}
      <div className="w-full">
        <InputGroup className="border-none rounded-none shadow-none">
          {draft.visibility === 'specified' && (
            <InputGroupAddon align="block-start" className="flex-col items-baseline">
              <div className="flex flex-wrap gap-1 items-center">
                <MailIcon className="size-3" />
                {t('recipient')}:
                {draft.visibleUsers.map((u) => (
                  <MkMention
                    key={u.id}
                    host={u.host}
                    username={u.username}
                    noNavigate
                    className="cursor-pointer"
                    onClick={() => {
                      draft.update({ visibleUsers: draft.visibleUsers.filter((x) => x.id != u.id) });
                    }}
                  >
                    <XIcon className="size-4 ml-1" />
                  </MkMention>
                ))}
              </div>
              {unspecifiedMentions.length > 0 && (
                <div className="flex flex-wrap gap-1 items-center">
                  <MailWarningIcon className="size-3" />
                  {t('notSpecifiedMentionWarning')}:
                  {unspecifiedMentions.map((u) => (
                    <MkMention key={u.acct} {...u} noNavigate />
                  ))}
                  <button
                    className="hover:underline"
                    onClick={() => {
                      addUnspecifiedMentionUser();
                    }}
                  >
                    {isAddingUser ? <Spinner /> : t('add')}
                  </button>
                </div>
              )}
            </InputGroupAddon>
          )}
          <InputGroupTextarea
            name="text"
            ref={textareaRef}
            className="@max-sm:text-sm"
            placeholder={placeholder}
            value={draft.text}
            onChange={(e) => {
              draft.update({ text: e.target.value });
            }}
            onFocus={() => {
              setCurrentFocusTextarea('text');
            }}
            onKeyDown={(k) => {
              if (k.ctrlKey && k.code == 'Enter' && sendable) {
                send(draft);
              }
            }}
          />
        </InputGroup>
      </div>
      {draft.showPreview && (
        <div className="w-full p-2 flex gap-2">
          <div>
            <MkAvatar user={me} avatarProps={{ className: 'size-12' }} />
          </div>
          <div className="flex flex-col text-sm gap-2 w-full">
            <MkUserName user={me} />
            {draft.hasCw ? (
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="cw">
                  <AccordionTrigger className="p-0 mb-2">
                    <MkMfm text={draft.cw} />
                  </AccordionTrigger>
                  <AccordionContent>
                    <MkMfm text={draft.text} parsedNodes={parsedText} />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ) : (
              <MkMfm text={draft.text} />
            )}
          </div>
        </div>
      )}
      <div className="mk-post-form__footer border-t flex justify-between p-2">
        <div className="mk-post-form__action flex @md:gap-1">
          {prependFooter}
          <PostFormButton label={t('addFile')}>
            <ImageIcon />
          </PostFormButton>
          <PostFormButton
            label={t('cw')}
            active={draft.hasCw}
            onClick={() => {
              draft.update({ hasCw: !draft.hasCw });
            }}
          >
            <MessageSquareWarningIcon />
          </PostFormButton>
          <PostFormButton label={t('poll')}>
            <ChartColumnIcon />
          </PostFormButton>
          <MkEmojiPickerPopup onEmojiChoose={onEmojiChoose} onClose={withDefer(() => textareaRef.current?.focus())}>
            <PostFormButton label={t('emoji')}>
              <SmilePlusIcon />
            </PostFormButton>
          </MkEmojiPickerPopup>
          <PostFormButton label={t('other')}>
            <MoreHorizontalIcon />
          </PostFormButton>
        </div>
        <div className="flex gap-1">
          <PostFormButton
            label={t('previewNoteText')}
            onClick={() => {
              draft.update({ showPreview: !draft.showPreview });
            }}
            active={draft.showPreview}
          >
            <EyeIcon />
          </PostFormButton>
          {appendFooter}
          <Button
            onClick={() => {
              send(draft);
            }}
            disabled={!sendable || isSending}
          >
            {isSending ? <Spinner /> : <PostBtnIcon />}
            <span className="@max-sm:hidden">{postBtnLabel}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

const PostFormButton = (
  props: { children: React.ReactNode; label: string; active?: boolean } & React.ComponentProps<typeof Button>,
) => {
  const { children, label, active, className, ...rest } = props;
  return (
    <Tooltip delayDuration={700}>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(className, {
            'bg-tertiary/10 text-tertiary hover:bg-tertiary/20 hover:text-tertiary': active,
          })}
          {...rest}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
};

const MkPostFormSkeleton = () => (
  <div className="mk-post-form-skeleton">
    <Skeleton className="w-full h-32" />
  </div>
);
