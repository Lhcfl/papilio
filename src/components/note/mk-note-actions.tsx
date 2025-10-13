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
          {count > 0 && <span className="ml-1 text-sm">{count}</span>}
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

  const { mutate: renote, isPending: isRenoting } = useRenoteAction(note.id);
  const { mutate: unrenote, isPending: isUnrenoting } = useUnrenoteAction(note.id);
  const { mutate: like, isPending: isReacting } = useLikeNoteAction(note.id);
  const { mutate: unreact, isPending: isUnReacting } = useUndoReactNoteAction(note.id);
  const { mutate: react } = useReactNoteAction(note.id);

  return (
    <div className="mk-note-actions p-2">
      <MkNoteActionButton
        icon={<ReplyIcon />}
        count={note.repliesCount}
        disabled={false}
        loading={false}
        tooltip={t('reply')}
        onClick={() => console.log('implement reply')}
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
      <MkNoteActionButton icon={<QuoteIcon />} onClick={() => console.log('implement quote')} tooltip={t('quote')} />
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
