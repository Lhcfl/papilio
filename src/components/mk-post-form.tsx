/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { getDraftKey, useDraft, type DraftData, type DraftKeyProps } from '@/hooks/use-draft';
import { Skeleton } from '@/components/ui/skeleton';
import { InputGroup, InputGroupAddon, InputGroupTextarea } from '@/components/ui/input-group';
import { useTranslation } from 'react-i18next';
import { MkAvatar } from '@/components/mk-avatar';
import { useMe } from '@/stores/me';
import { Button } from '@/components/ui/button';
import {
  ChartColumnIcon,
  CircleAlertIcon,
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
  XCircleIcon,
  XIcon,
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { MkEmojiPickerPopup } from '@/components/mk-emoji-picker-popup';
import type { DriveFile, EmojiSimple, User } from 'misskey-js/entities.js';
import { useEffect, useRef, useState, type HTMLProps } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { misskeyApi, site } from '@/services/inject-misskey-api';
import { Spinner } from '@/components/ui/spinner';
import type { NoteWithExtension } from '@/types/note';
import { cond } from '@/lib/match';
import * as mfm from 'mfm-js';
import { collectAst } from '@/lib/note';
import { MkMention } from '@/components/mk-mention';
import { getAcctUserQueryOptions } from '@/hooks/use-user';
import { MkVisibilityPicker } from '@/components/post-form/mk-visibility-picker';
import { useMount } from 'react-use';
import { MkPostFormPreview } from '@/components/post-form/mk-post-form-preview';
import { MkFileUploadMenu } from '@/components/mk-file-upload-menu';
import { toast } from 'sonner';
import { errorMessageSafe } from '@/lib/error';
import { useUploader } from '@/hooks/use-uploader';
import { MkPostFormFiles } from '@/components/post-form/mk-post-form-files';
import { extractMention } from '@/lib/mention';
import { MkNoteSimple } from '@/components/mk-note-simple';
import { useSiteMeta } from '@/stores/site';
import { Progress } from '@/components/ui/progress';
import { useErrorDialogs } from '@/stores/error-dialog';
import { useConfirmDialog } from '@/stores/confirm-dialog';

type MkPostFormProps = DraftKeyProps & {
  onSuccess?: () => void;
  autoFocus?: boolean;
  visibilityRestrict?: DraftData['visibility'][];
  relatedNote?: NoteWithExtension;
  prependHeader?: React.ReactNode;
  appendHeader?: React.ReactNode;
  prependFooter?: React.ReactNode;
  appendFooter?: React.ReactNode;
  displayRelatedNote?: boolean;
} & HTMLProps<HTMLDivElement>;

export function MkPostForm(props: MkPostFormProps) {
  const me = useMe();
  const { replyId, editId, quoteId, visibilityRestrict, relatedNote } = props;

  const draftKey = getDraftKey({ replyId, editId, quoteId });

  // make react compiler happy
  const relatedCw = relatedNote?.cw;

  const draft = useDraft(draftKey, {
    visibility: visibilityRestrict?.at(0),
    localOnly: relatedNote?.localOnly,
    cw:
      cond([
        [editId != null, relatedCw],
        [replyId != null, relatedCw],
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
}

function MkPostFormLoaded(
  props: MkPostFormProps & {
    draftKey: string;
    draft: NonNullable<ReturnType<typeof useDraft>>;
  },
) {
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
    displayRelatedNote,
    ...rest
  } = props;

  // #region States And Hooks
  const siteDomain = new URL(site!).hostname;
  const { t } = useTranslation();
  const maxNoteTextLength = useSiteMeta((m) => m.maxNoteTextLength);
  const usedTextLengthLimitPercent = Math.min((draft.text.length / maxNoteTextLength) * 100, 100);
  const textLimitRemaining = maxNoteTextLength - draft.text.length;
  const me = useMe();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const cwRef = useRef<HTMLTextAreaElement>(null);
  const [currentFocusTextarea, setCurrentFocusTextarea] = useState<'text' | 'cw'>('text');
  const placeholder = t('_postForm._placeholders.f');
  const queryClient = useQueryClient();
  const uploadFile = useUploader();

  const sendable =
    draft.text.length < maxNoteTextLength &&
    [draft.text.trim().length > 0, draft.hasCw && draft.cw.trim().length > 0].some((v) => v);

  // performance: if exceeding limit too much, stop parse MFM, because the mfm parser is slow
  // this is actually a Self-DoS but sometimes users do that unintentionally (copy-paste huge text)
  // so we just prevent it here
  const parsedText = textLimitRemaining > -1000 ? mfm.parse(draft.text) : [];
  const mentionedUsers = collectAst(parsedText, (node) => (node.type === 'mention' ? node.props : undefined));
  const unspecifiedMentions = mentionedUsers.filter((u) =>
    draft.visibleUsers.every((vu) => u.username != vu.username || (u.host != siteDomain && u.host != vu.host)),
  );
  const PostBtnIcon = props.replyId ? ReplyIcon : props.quoteId ? QuoteIcon : props.editId ? PencilIcon : SendIcon;
  const postBtnLabel = props.replyId ? t('reply') : props.quoteId ? t('quote') : props.editId ? t('edit') : t('note');

  // #endregion States And Hooks

  // #region Actions and Callbacks
  const pushErrorDialog = useErrorDialogs((s) => s.pushDialog);
  const pushConfirmDialog = useConfirmDialog((s) => s.pushDialog);

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
        draft.resetExcept(['visibility', 'cw', 'hasCw', 'showPreview', 'reactionAcceptance', 'localOnly']);
      }
    },
  });

  function focusTextarea() {
    setTimeout(() => {
      if (currentFocusTextarea == 'cw') {
        cwRef.current?.focus();
      } else {
        textareaRef.current?.focus();
      }
    }, 10);
  }

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

  async function onFileUpload(promises: Promise<DriveFile>[]) {
    const allSettled = await Promise.allSettled(promises);
    const oks: DriveFile[] = [];
    for (const res of allSettled) {
      if (res.status === 'fulfilled') {
        oks.push(res.value);
      } else {
        toast.error(errorMessageSafe(res.reason));
      }
    }
    draft.update({ files: [...draft.files, ...oks] });
  }
  // #region Actions and Callbacks

  // #region Effects

  useMount(() => {
    const textarea = textareaRef.current;
    if (textarea && autoFocus) {
      textarea.focus();
    }
    textarea?.setSelectionRange(draft.text.length, draft.text.length);
  });

  useEffect(() => {
    if (draft.visibility == 'specified') {
      addUnspecifiedMentionUser();
    }
  }, [draft.visibility, addUnspecifiedMentionUser]);

  // #endregion Effects

  return (
    <div className={cn('mk-post-form rounded-md bg-background @container', className)} {...rest}>
      {displayRelatedNote && relatedNote && (
        <MkNoteSimple
          className="-m-2"
          noteId={relatedNote.id}
          disableRouteOnClick
          bodyProps={{ className: 'text-sm!' }}
          isSubNote
          showLeftLine
        />
      )}
      <div className="mk-post-form__title p-2 border-b flex items-center justify-between">
        <div className="flex items-center">
          <MkAvatar user={me} className={cn({ 'ml-1': !!(displayRelatedNote && relatedNote) })} />
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
            className={cn('@max-sm:text-sm', {
              'pb-7': usedTextLengthLimitPercent >= 70,
            })}
            placeholder={placeholder}
            value={draft.text}
            onChange={(e) => {
              // If the user exceeded the limit by a large margin and is still typing, blur the textarea to prevent further input.
              if (textLimitRemaining <= -1000 && draft.text.length < e.target.value.length) {
                e.currentTarget.blur();
                pushErrorDialog({
                  description:
                    'You have exceeded the maximum note length limit. Please shorten your note before continuing.',
                });
              }
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
            onPaste={(ev) => {
              const files = ev.clipboardData.files;
              if (files.length > 0) {
                ev.preventDefault();
                ev.stopPropagation();
                void onFileUpload(Array.from(files).map((f) => uploadFile(f)));
              }
              const text = ev.clipboardData.getData('text');
              if (text.length > 2000) {
                ev.preventDefault();
                ev.stopPropagation();
                pushConfirmDialog({
                  title: t('areYouSure'),
                  description: t('attachAsFileQuestion'),
                  onConfirm: () => {
                    const file = new File([new Blob([text], { type: 'text/plain' })], 'pasted-text.txt');
                    void onFileUpload([uploadFile(file)]);
                  },
                  onCancel: () => {
                    const textarea = textareaRef.current;
                    if (!textarea) return;
                    const start = textarea.selectionStart;
                    const end = textarea.selectionEnd;
                    const value = textarea.value;
                    textarea.value = value.slice(0, start) + text + value.slice(end);
                    textarea.selectionStart = textarea.selectionEnd = start + text.length;
                  },
                });
              }
            }}
          />
        </InputGroup>
      </div>
      <MkPostFormPreview
        className="w-full p-2 flex gap-2"
        user={me}
        text={draft.text}
        parsedText={parsedText}
        cw={draft.cw}
        hasCw={draft.hasCw}
        showPreview={draft.showPreview}
      />
      <MkPostFormFiles
        className="w-full p-2"
        files={draft.files}
        updateFiles={(f) => {
          draft.update({ files: f(draft.files) });
        }}
      />
      {usedTextLengthLimitPercent >= 70 && (
        <div className="relative">
          <div
            className={cn(
              'absolute right-1 bottom-1 px-1 py-0.5 flex items-center gap-1 text-sm bg-background border rounded-md pointer-events-none',
              {
                'text-yellow-500': textLimitRemaining >= 0,
                'text-red-500': textLimitRemaining < 0,
              },
            )}
          >
            {textLimitRemaining >= 0 ? <CircleAlertIcon className="size-4" /> : <XCircleIcon className="size-4" />}
            {t('remainingN', { n: textLimitRemaining })}
          </div>
          <Progress value={usedTextLengthLimitPercent} className="rounded-none h-0.5" />
        </div>
      )}
      <div className="mk-post-form__footer border-t flex justify-between p-2">
        <div className="mk-post-form__action flex @md:gap-1">
          {prependFooter}
          <MkFileUploadMenu onUpload={onFileUpload}>
            <PostFormButton label={t('addFile')}>
              <ImageIcon />
            </PostFormButton>
          </MkFileUploadMenu>
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
          <MkEmojiPickerPopup onEmojiChoose={onEmojiChoose} onClose={focusTextarea}>
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
}

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
