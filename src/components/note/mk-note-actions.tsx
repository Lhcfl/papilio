/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { useTranslation } from 'react-i18next';
import {
  GlobeIcon,
  HeartIcon,
  HeartMinusIcon,
  HomeIcon,
  LockIcon,
  MoreHorizontalIcon,
  QuoteIcon,
  RepeatIcon,
  ReplyIcon,
  SmilePlusIcon,
  ToggleLeftIcon,
  ToggleRightIcon,
} from 'lucide-react';
import { useState, type ComponentProps } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useNoteMenu } from './mk-note-menu';
import { MkEmojiPickerPopup } from '@/components/mk-emoji-picker-popup';
import type { NoteWithExtension } from '@/types/note';
import {
  useLikeNoteAction,
  useReactNoteAction,
  useRenoteAction,
  useUndoReactNoteAction,
  useUnrenoteAction,
} from '@/hooks/note-actions';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useRightbarOrPopup } from '@/stores/rightbar-or-poup';
import { MkPostForm } from '@/components/mk-post-form';
import { MkNoteSimple } from '@/components/mk-note-simple';
import { VISIBILITIES } from '@/lib/note';
import { MenuOrDrawer, type Menu } from '@/components/menu-or-drawer';

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
  const { loading = false, disabled = false, icon, count = 0, tooltip, ...rest } = props;
  return (
    <Tooltip delayDuration={1000}>
      <TooltipTrigger asChild>
        <Button variant="ghost" size={count > 0 ? 'default' : 'icon'} disabled={disabled || loading} {...rest}>
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
  const noteMenu = useNoteMenu({ onTranslate, note });

  const [renoteLocalOnly, setRenoteLocalOnly] = useState(false);

  const renoteMenu: Menu = [
    {
      id: 'g-vis',
      type: 'group',
      items: [
        { id: 'lbl', type: 'label', label: t('renote') },
        note.visibility === 'public' && {
          id: 'vis-public',
          type: 'item',
          icon: <GlobeIcon />,
          label: t('public'),
          onClick: () => {
            renote({ visibility: 'public', localOnly: renoteLocalOnly });
          },
        },
        {
          id: 'vis-home',
          type: 'item',
          icon: <HomeIcon />,
          label: t('home'),
          onClick: () => {
            renote({ visibility: 'home', localOnly: renoteLocalOnly });
          },
        },
        {
          id: 'vis-followers',
          type: 'item',
          icon: <LockIcon />,
          label: t('followers'),
          onClick: () => {
            renote({ visibility: 'followers', localOnly: renoteLocalOnly });
          },
        },
      ],
    },
    {
      id: 'g-switch',
      type: 'group',
      items: [
        null,
        { id: 'local-lbl', type: 'label', label: t('federation') },
        {
          id: 'vis-local',
          type: 'item',
          icon: renoteLocalOnly ? <ToggleRightIcon /> : <ToggleLeftIcon className="opacity-60" />,
          label: t('localOnly'),
          preventCloseOnClick: true,
          onClick: () => {
            setRenoteLocalOnly(!renoteLocalOnly);
          },
        },
      ],
    },
  ];

  const openForm = ({
    icon,
    title,
    postFormProps,
  }: {
    icon: React.ReactNode;
    title: React.ReactNode;
    postFormProps: React.ComponentProps<typeof MkPostForm>;
  }) => {
    openRightbarOrPopup({
      title: (
        <div className="flex gap-2">
          {icon}
          {title}
        </div>
      ),
      node: (
        <div className="p-2">
          <MkNoteSimple noteId={note.id} disableRouteOnClick className="border text-sm rounded-md mb-2" />
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
  };

  const openQuoteForm = () => {
    openForm({ icon: <QuoteIcon />, title: t('quote'), postFormProps: { quoteId: note.id } });
  };

  const openReplyForm = () => {
    openForm({ icon: <ReplyIcon />, title: t('reply'), postFormProps: { replyId: note.id } });
  };

  return (
    <div className="mk-note-actions p-2 flex">
      <MkNoteActionButton
        icon={<ReplyIcon />}
        count={note.repliesCount}
        disabled={false}
        loading={false}
        tooltip={t('reply')}
        onClick={() => {
          openReplyForm();
        }}
      />
      {isRenoted ? (
        <MkNoteActionButton
          className="text-tertiary hover:bg-tertiary/10"
          icon={<RepeatIcon />}
          count={note.renoteCount}
          loading={isUnrenoting}
          tooltip={t('unrenote')}
          onClick={() => {
            unrenote(void null, {
              onSuccess: () => toast.success(t('unrenote')),
            });
          }}
        />
      ) : (
        <MenuOrDrawer menu={renoteMenu}>
          <MkNoteActionButton
            icon={<RepeatIcon />}
            count={note.renoteCount}
            disabled={note.visibility !== 'public' && note.visibility !== 'home'}
            loading={isRenoting}
            tooltip={t('renote')}
          />
        </MenuOrDrawer>
      )}
      <MkNoteActionButton
        icon={<QuoteIcon />}
        onClick={() => {
          openQuoteForm();
        }}
        tooltip={t('quote')}
      />
      {note.myReaction == null ? (
        <>
          <MkNoteActionButton
            icon={<HeartIcon />}
            onClick={() => {
              like();
            }}
            loading={isReacting}
            tooltip={t('like')}
          />
          {!isReacting && (
            <MkEmojiPickerPopup
              onEmojiChoose={(emoji) => {
                react(typeof emoji === 'string' ? emoji : `:${emoji.name}:`);
              }}
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
          onClick={() => {
            unreact();
          }}
          loading={isUnReacting}
          tooltip={t('unlike')}
        />
      )}

      <MenuOrDrawer menu={noteMenu}>
        <MkNoteActionButton icon={<MoreHorizontalIcon />} tooltip={t('menu')} />
      </MenuOrDrawer>
    </div>
  );
};
