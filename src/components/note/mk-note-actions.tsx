import { useTranslation } from 'react-i18next';
import {
  HeartIcon,
  HeartMinusIcon,
  MoreHorizontalIcon,
  QuoteIcon,
  RepeatIcon,
  ReplyIcon,
  SmilePlusIcon,
} from 'lucide-react';
import type { ComponentProps } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Spinner } from '../ui/spinner';
import { MkNoteMenu } from './mk-note-menu';
import { MkEmojiPickerPopup } from '../mk-emoji-picker-popup';
import type { NoteWithExtension } from '@/types/note';
import {
  useLikeNoteAction,
  useReactNoteAction,
  useRenoteAction,
  useUndoReactNoteAction,
  useUnrenoteAction,
} from '@/hooks/note-actions';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { useRightbarOrPopup } from '@/stores/rightbar-or-poup';
import { MkPostForm } from '../mk-post-form';
import { MkNoteSimple } from '../mk-note-simple';
import { VISIBILITIES } from '@/lib/note';

const MkNoteActionButton = (
  props: {
    icon: React.ReactNode;
    count?: number;
    loading?: boolean;
    disabled?: boolean;
    tooltip?: string;
    onClick?: () => void;
  } & ComponentProps<typeof Button>,
) => {
  const { loading, icon, count = 0, tooltip, ...rest } = props;
  return (
    <Tooltip delayDuration={1000}>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size={count > 0 ? 'default' : 'icon'}
          disabled={props.disabled || props.loading}
          {...rest}
        >
          {loading ? <Spinner /> : icon}
          {count > 0 && <span>{count}</span>}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  );
};

export const MkNoteActions = (props: { note: NoteWithExtension; onTranslate: () => void }) => {
  const { note, onTranslate } = props;
  const { t } = useTranslation();

  const isRenoted = note.isRenoted;

  const openRightbarOrPopup = useRightbarOrPopup((s) => s.push);
  const closeRightbarOrPopup = useRightbarOrPopup((s) => s.close);
  const { mutate: renote, isPending: isRenoting } = useRenoteAction(note.id);
  const { mutate: unrenote, isPending: isUnrenoting } = useUnrenoteAction(note.id);
  const { mutate: like, isPending: isReacting } = useLikeNoteAction(note.id);
  const { mutate: unreact, isPending: isUnReacting } = useUndoReactNoteAction(note.id);
  const { mutate: react } = useReactNoteAction(note.id);

  const openForm = ({
    icon,
    title,
    postFormProps,
  }: {
    icon: React.ReactNode;
    title: React.ReactNode;
    postFormProps: React.ComponentProps<typeof MkPostForm>;
  }) =>
    openRightbarOrPopup({
      title: (
        <div className="flex gap-2">
          {icon}
          {title}
        </div>
      ),
      node: (
        <div className="p-2">
          <MkNoteSimple noteId={note.id} className="border text-sm rounded-md mb-2" />
          <MkPostForm
            {...postFormProps}
            autoFocus
            className="border"
            onSuccess={closeRightbarOrPopup}
            visibilityRestrict={VISIBILITIES.slice(VISIBILITIES.indexOf(note.visibility))}
            relatedNote={note}
          />
        </div>
      ),
    });

  const openQuoteForm = () => openForm({ icon: <QuoteIcon />, title: t('quote'), postFormProps: { quoteId: note.id } });

  const openReplyForm = () => openForm({ icon: <ReplyIcon />, title: t('reply'), postFormProps: { replyId: note.id } });

  return (
    <div className="mk-note-actions p-2 flex">
      <MkNoteActionButton
        icon={<ReplyIcon />}
        count={note.repliesCount}
        disabled={false}
        loading={false}
        tooltip={t('reply')}
        onClick={() => openReplyForm()}
      />
      {isRenoted ? (
        <MkNoteActionButton
          className="text-tertiary hover:bg-tertiary/10"
          icon={<RepeatIcon />}
          count={note.renoteCount}
          loading={isUnrenoting}
          tooltip={t('unrenote')}
          onClick={() =>
            unrenote(void null, {
              onSuccess: () => toast.success(t('unrenote')),
            })
          }
        />
      ) : (
        <MkNoteActionButton
          icon={<RepeatIcon />}
          count={note.renoteCount}
          disabled={note.visibility !== 'public' && note.visibility !== 'home'}
          loading={isRenoting}
          tooltip={t('renote')}
          onClick={() =>
            renote(props.note.visibility as 'public' | 'home', {
              onSuccess: () => toast.success(t('renoted')),
            })
          }
        />
      )}
      <MkNoteActionButton icon={<QuoteIcon />} onClick={() => openQuoteForm()} tooltip={t('quote')} />
      {note.myReaction == null ? (
        <>
          <MkNoteActionButton icon={<HeartIcon />} onClick={() => like()} loading={isReacting} tooltip={t('like')} />
          {!isReacting && (
            <MkEmojiPickerPopup
              onEmojiChoose={(emoji) => react(typeof emoji === 'string' ? emoji : `:${emoji.name}:`)}
              autoClose
            >
              <MkNoteActionButton
                count={note.reactionCount}
                icon={<SmilePlusIcon />}
                loading={isReacting}
                tooltip={t('doReaction')}
              />
            </MkEmojiPickerPopup>
          )}
        </>
      ) : (
        <MkNoteActionButton
          className="text-tertiary hover:bg-tertiary/10"
          icon={<HeartMinusIcon />}
          onClick={() => unreact()}
          loading={isUnReacting}
          tooltip={t('unlike')}
        />
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <MkNoteActionButton icon={<MoreHorizontalIcon />} tooltip={t('menu')} />
        </DropdownMenuTrigger>
        <MkNoteMenu onTranslate={onTranslate} note={note} />
      </DropdownMenu>
    </div>
  );
};
