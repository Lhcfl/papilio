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
  GlobeIcon,
  HomeIcon,
  ImageIcon,
  LockIcon,
  MailIcon,
  MessageSquareWarningIcon,
  MoreHorizontalIcon,
  PencilIcon,
  QuoteIcon,
  ReplyIcon,
  SendIcon,
  SmilePlusIcon,
  WifiIcon,
  WifiOffIcon,
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { MkMfm } from './mk-mfm';
import { cn, withDefer } from '@/lib/utils';
import { MkUserName } from './mk-user-name';
import { MkEmojiPickerPopup } from './mk-emoji-picker-popup';
import type { EmojiSimple } from 'misskey-js/entities.js';
import { useRef, useState, type ComponentProps, type HTMLProps } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useMutation } from '@tanstack/react-query';
import { misskeyApi } from '@/services/inject-misskey-api';
import { Spinner } from './ui/spinner';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import type { NoteWithExtension } from '@/types/note';
import { matchFirst } from '@/lib/match';
import * as mfm from 'mfm-js';
import { acct } from 'misskey-js';
import { collectAst } from '@/lib/note';
import { ButtonGroup } from './ui/button-group';

function useRandomPostFormPlaceholder() {
  const { t } = useTranslation();
  const samples = [
    t('_postForm._placeholders.a'),
    t('_postForm._placeholders.b'),
    t('_postForm._placeholders.c'),
    t('_postForm._placeholders.d'),
    t('_postForm._placeholders.e'),
    t('_postForm._placeholders.f'),
  ];
  return samples.at(Math.floor(Math.random() * samples.length));
}

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

export const MkPostForm = (
  props: DraftKeyProps & {
    onSuccess?: () => void;
    autoFocus?: boolean;
    visibilityRestrict?: DraftData['visibility'][];
    relatedNote?: NoteWithExtension;
  } & HTMLProps<HTMLDivElement>,
) => {
  const { replyId, editId, quoteId, onSuccess, autoFocus, relatedNote, visibilityRestrict, className, ...rest } = props;

  const { t } = useTranslation();
  const me = useMe();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const cwRef = useRef<HTMLTextAreaElement>(null);
  const [currentFocusTextarea, setCurrentFocusTextarea] = useState<'text' | 'cw'>('text');
  const placeholder = useRandomPostFormPlaceholder();

  const draftKey = getDraftKey({ replyId, editId, quoteId });
  const draft = useDraft(draftKey, {
    visibility: visibilityRestrict?.at(0),
    cw:
      matchFirst([
        [editId != null, relatedNote?.cw],
        [replyId != null, relatedNote?.cw],
        [true, null],
      ]) ?? undefined,
    text:
      matchFirst([
        [editId != null, relatedNote?.text],
        [replyId != null, extractMention(relatedNote, me)],
        [true, null],
      ]) ?? undefined,
  });

  const { mutate: send, isPending: isSending } = useMutation({
    mutationKey: ['post', draftKey],
    mutationFn: (data: DraftData) =>
      editId
        ? misskeyApi('notes/edit', {
            editId,
            cw: data.hasCw ? data.cw : undefined,
            text: data.text,
            fileIds: data.files.length > 0 ? data.files.map((f) => f.id) : undefined,
          })
        : misskeyApi('notes/create', {
            visibility: data.visibility,
            visibleUserIds: data.visibility === 'specified' ? data.visibleUserIds : undefined,
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
        draft?.remove();
      } else {
        draft?.resetExcept(['visibility', 'cw', 'hasCw', 'showPreview', 'reactionAcceptance']);
      }
    },
  });

  if (!draft) return <MkPostFormSkeleton />;

  const sendable = [draft.text.trim().length > 0, draft.hasCw && draft.cw.trim().length > 0].some((v) => v);

  function onEmojiChoose(emoji: string | EmojiSimple) {
    const textarea = currentFocusTextarea === 'cw' ? cwRef.current : textareaRef.current;
    if (!textarea) return;
    if (!draft) return;
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
        <MkAvatar user={me} />
        <div className="mk-post-form__control">
          <VisibilityPicker
            className="-mr-2"
            visibility={draft.visibility}
            setVisibility={(v) => draft.update({ visibility: v })}
            visibilityRestrict={visibilityRestrict}
            disabled={!!editId}
          />
          {draft.localOnly ? (
            <PostFormButton
              label={t('localOnly')}
              onClick={() => draft.update({ localOnly: false })}
              variant="ghost"
              className="text-destructive! hover:bg-destructive/10"
            >
              <WifiOffIcon />
            </PostFormButton>
          ) : (
            <PostFormButton label={t('federating')} onClick={() => draft.update({ localOnly: true })} variant="ghost">
              <WifiIcon />
            </PostFormButton>
          )}
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
              onChange={(e) => draft.update({ cw: e.target.value })}
              onFocus={() => setCurrentFocusTextarea('cw')}
            />
          </InputGroup>
          <div className="border-b" />
        </div>
      )}
      <div className="w-full">
        <InputGroup className="border-none rounded-none shadow-none">
          <InputGroupTextarea
            name="text"
            ref={(el) => {
              textareaRef.current = el;
              if (el && autoFocus) {
                el.focus();
              }
              el?.setSelectionRange(draft.text.length, draft.text.length);
            }}
            className="@max-sm:text-sm"
            placeholder={placeholder}
            value={draft.text}
            onChange={(e) => draft.update({ text: e.target.value })}
            onFocus={() => setCurrentFocusTextarea('text')}
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
                    <MkMfm text={draft.text} />
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
          <PostFormButton label={t('addFile')}>
            <ImageIcon />
          </PostFormButton>
          <PostFormButton label={t('cw')} active={draft.hasCw} onClick={() => draft.update({ hasCw: !draft.hasCw })}>
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
            onClick={() => draft.update({ showPreview: !draft.showPreview })}
            active={draft.showPreview}
          >
            <EyeIcon />
          </PostFormButton>
          <Button onClick={() => send(draft)} disabled={!sendable || isSending}>
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

const VisibilityPicker = (
  props: {
    visibility: DraftData['visibility'];
    setVisibility: (v: DraftData['visibility']) => void;
    disabled?: boolean;
    visibilityRestrict?: DraftData['visibility'][];
  } & ComponentProps<typeof Button>,
) => {
  const { t } = useTranslation();

  const {
    visibility,
    setVisibility,
    disabled = props.visibilityRestrict?.length === 0,
    visibilityRestrict,
    ...btnProps
  } = props;

  const visibilities = {
    public: {
      icon: <GlobeIcon />,
      label: t('_visibility.public'),
      description: t('_visibility.publicDescription'),
    },
    home: {
      icon: <HomeIcon />,
      label: t('_visibility.home'),
      description: t('_visibility.homeDescription'),
    },
    followers: {
      icon: <LockIcon />,
      label: t('_visibility.followers'),
      description: t('_visibility.followersDescription'),
    },
    specified: {
      icon: <MailIcon />,
      label: t('_visibility.specified'),
      description: t('_visibility.specifiedDescription'),
    },
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" disabled={disabled} {...btnProps}>
          {visibilities[visibility].icon}
          {visibilities[visibility].label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {Object.entries(visibilities).map(([key, v]) => (
          <DropdownMenuItem
            key={key}
            onClick={() => setVisibility(key as DraftData['visibility'])}
            disabled={visibilityRestrict && !visibilityRestrict.includes(key as DraftData['visibility'])}
          >
            {v.icon}
            <div>
              <div>{v.label}</div>
              <div className="text-xs text-muted-foreground">{v.description}</div>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
