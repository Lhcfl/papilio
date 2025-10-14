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
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { MkMfm } from './mk-mfm';
import { cn, withDefer } from '@/lib/utils';
import { MkUserName } from './mk-user-name';
import { MkEmojiPickerPopup } from './mk-emoji-picker-popup';
import type { EmojiSimple } from 'misskey-js/entities.js';
import { useEffect, useRef, useState, type HTMLProps } from 'react';
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

export const MkPostForm = (
  props: DraftKeyProps & {
    onSuccess?: () => void;
    autoFocus?: boolean;
  } & HTMLProps<HTMLDivElement>,
) => {
  const { replyId, editId, quoteId, onSuccess, autoFocus, className, ...rest } = props;

  const draftKey = getDraftKey({ replyId, editId, quoteId });
  const draft = useDraft(draftKey);
  const { t } = useTranslation();
  const me = useMe();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const cwRef = useRef<HTMLTextAreaElement>(null);
  const [currentFocusTextarea, setCurrentFocusTextarea] = useState<'text' | 'cw'>('text');
  const placeholder = useRandomPostFormPlaceholder();

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
            visibility={draft.visibility}
            setVisibility={(v) => draft.update({ visibility: v })}
            disabled={!!editId}
          />
        </div>
      </div>
      {draft.hasCw && (
        <div className="w-full">
          <InputGroup className="rounded-none shadow-none border-none">
            <InputGroupAddon align="block-start" className="-mb-4 p-2">
              <span className="text-xs text-muted-foreground">{t('cw')}</span>
            </InputGroupAddon>
            <InputGroupTextarea
              className="min-h-2"
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
            }}
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
          <PostFormFooterButton label={t('addFile')}>
            <ImageIcon />
          </PostFormFooterButton>
          <PostFormFooterButton
            label={t('cw')}
            active={draft.hasCw}
            onClick={() => draft.update({ hasCw: !draft.hasCw })}
          >
            <MessageSquareWarningIcon />
          </PostFormFooterButton>
          <PostFormFooterButton label={t('poll')}>
            <ChartColumnIcon />
          </PostFormFooterButton>
          <MkEmojiPickerPopup onEmojiChoose={onEmojiChoose} onClose={withDefer(() => textareaRef.current?.focus())}>
            <PostFormFooterButton label={t('emoji')}>
              <SmilePlusIcon />
            </PostFormFooterButton>
          </MkEmojiPickerPopup>
          <PostFormFooterButton label={t('other')}>
            <MoreHorizontalIcon />
          </PostFormFooterButton>
        </div>
        <div className="flex gap-1">
          <PostFormFooterButton
            label={t('previewNoteText')}
            onClick={() => draft.update({ showPreview: !draft.showPreview })}
            active={draft.showPreview}
          >
            <EyeIcon />
          </PostFormFooterButton>
          <Button onClick={() => send(draft)} disabled={!sendable || isSending}>
            {isSending ? <Spinner /> : <PostBtnIcon />}
            <span className="@max-sm:hidden">{postBtnLabel}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

const PostFormFooterButton = (
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

const VisibilityPicker = (props: {
  visibility: DraftData['visibility'];
  setVisibility: (v: DraftData['visibility']) => void;
  disabled?: boolean;
}) => {
  const { t } = useTranslation();

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
        <Button variant="ghost" disabled={props.disabled}>
          {visibilities[props.visibility].icon}
          {visibilities[props.visibility].label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {Object.entries(visibilities).map(([key, v]) => (
          <DropdownMenuItem key={key} onClick={() => props.setVisibility(key as DraftData['visibility'])}>
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
