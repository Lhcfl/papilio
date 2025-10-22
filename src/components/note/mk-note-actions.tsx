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
  LanguagesIcon,
  LockIcon,
  MoreHorizontalIcon,
  QuoteIcon,
  RepeatIcon,
  ReplyIcon,
  SmilePlusIcon,
  ToggleLeftIcon,
  ToggleRightIcon,
  XIcon,
} from 'lucide-react';
import { useState, type ComponentProps } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useNoteMenu } from '@/components/note/mk-note-menu';
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
import { VISIBILITIES } from '@/lib/note';
import { MenuOrDrawer, type Menu } from '@/components/menu-or-drawer';
import { useMisskeyForkFeatures } from '@/stores/node-info';
import { useMutation, useMutationState } from '@tanstack/react-query';
import { misskeyApi } from '@/services/inject-misskey-api';
import { patchNote } from '@/hooks/use-note';
import { cn } from '@/lib/utils';
import { usePreference } from '@/stores/perference';
import { useSiteMeta } from '@/stores/site';

const MkNoteActionButton = (
  props: {
    icon: React.ReactNode;
    count?: number;
    activated?: boolean;
    loading?: boolean;
    disabled?: boolean;
    tooltip?: string;
  } & ComponentProps<typeof Button>,
) => {
  const { loading = false, disabled = false, activated, icon, count = 0, tooltip, className, ...rest } = props;
  const showCount = usePreference((x) => x.showNoteActionCounts);
  return (
    <Tooltip delayDuration={1000}>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            'border border-transparent',
            {
              'text-tertiary hover:bg-tertiary/10': activated,
            },
            className,
          )}
          size={count > 0 ? 'default' : 'icon'}
          disabled={disabled || loading}
          {...rest}
        >
          {loading ? <Spinner /> : icon}
          {count > 0 && showCount && <span>{count}</span>}
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

  const disableReactions = usePreference((x) => x.disableNoteReactions);
  const postFormStyle = usePreference((x) => x.notePostFormStyle);
  const showTranslateInActions = usePreference((x) => x.showTranslateInActions);
  const openRightbarOrPopup = useRightbarOrPopup((s) => s.push);
  const closeRightbarOrPopup = useRightbarOrPopup((s) => s.close);
  const { mutate: renote, isPending: isRenoting } = useRenoteAction(note.id);
  const { mutate: unrenote, isPending: isUnrenoting } = useUnrenoteAction(note.id);
  const { mutate: like, isPending: isReacting } = useLikeNoteAction(note.id);
  const { mutate: unreact, isPending: isUnReacting } = useUndoReactNoteAction(note.id);
  const { mutate: react } = useReactNoteAction(note.id);
  const noteMenu = useNoteMenu({ onTranslate, note });
  const features = useMisskeyForkFeatures();
  const translatorAvailable = useSiteMeta((s) => s.translatorAvailable);
  const hasTranslation =
    useMutationState({
      filters: { mutationKey: ['translateNote', note.id] },
      select: (mu) => mu.state,
    }).length > 0;

  const [renoteLocalOnly, setRenoteLocalOnly] = useState(false);
  const [postFormProps, setPostFormProps] = useState<ComponentProps<typeof MkPostForm> | null>(null);

  const { mutate: syncNote } = useMutation({
    mutationKey: ['sync:note/state', note.id],
    mutationFn: async () => {
      patchNote(note.id, { 'papi:isSyncing:notes/state': true });
      const res = await misskeyApi('notes/state', { noteId: note.id });
      patchNote(note.id, {
        isFavorited: res.isFavorited,
        isMutingThread: res.isMutedThread,
        'papi:isSyncing:notes/state': false,
      });
      return res;
    },
  });

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
          <MkPostForm
            {...postFormProps}
            autoFocus
            className="border"
            onSuccess={closeRightbarOrPopup}
            visibilityRestrict={VISIBILITIES.slice(VISIBILITIES.indexOf(note.visibility))}
            relatedNote={note}
            displayRelatedNote
          />
        </div>
      ),
    });
  };

  const openQuoteForm = () => {
    switch (postFormStyle) {
      case 'bottom': {
        setPostFormProps({
          quoteId: note.id,
          visibilityRestrict: VISIBILITIES.slice(VISIBILITIES.indexOf(note.visibility)),
        });
        return;
      }
      case 'separate': {
        openForm({ icon: <QuoteIcon />, title: t('quote'), postFormProps: { quoteId: note.id } });
        return;
      }
    }
  };

  const openReplyForm = () => {
    switch (postFormStyle) {
      case 'bottom': {
        setPostFormProps({
          replyId: note.id,
          visibilityRestrict: VISIBILITIES.slice(VISIBILITIES.indexOf(note.visibility)),
        });
        return;
      }
      case 'separate': {
        openForm({ icon: <ReplyIcon />, title: t('reply'), postFormProps: { replyId: note.id } });
        return;
      }
    }
  };

  return (
    <div className="mk-note-actions p-2">
      <div className="mk-note-actions__buttons flex">
        <MkNoteActionButton
          activated={postFormProps?.replyId != null}
          className={cn({
            'bg-tertiary/10': postFormProps?.replyId != null,
          })}
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
            activated={isRenoted}
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
          activated={postFormProps?.quoteId != null}
          className={cn({
            'bg-tertiary/10': postFormProps?.quoteId != null,
          })}
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
              count={disableReactions ? note.reactionCount : undefined}
              loading={isReacting}
              tooltip={t('like')}
            />
            {!isReacting && !disableReactions && (
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
            count={disableReactions ? note.reactionCount : undefined}
            loading={isUnReacting}
            tooltip={t('unlike')}
          />
        )}
        {showTranslateInActions && translatorAvailable && (
          <MkNoteActionButton
            icon={<LanguagesIcon />}
            onClick={() => {
              onTranslate();
            }}
            activated={hasTranslation}
            tooltip={t('translate')}
          />
        )}
        <MenuOrDrawer
          menu={noteMenu}
          onOpen={() => {
            if (!features.noNeedGetNoteState) {
              syncNote();
            }
          }}
        >
          <MkNoteActionButton icon={<MoreHorizontalIcon />} tooltip={t('menu')} />
        </MenuOrDrawer>
      </div>
      {postFormProps && (
        <MkPostForm
          {...postFormProps}
          relatedNote={note}
          className="mt-2 border"
          appendHeader={
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setPostFormProps(null);
              }}
            >
              <XIcon />
            </Button>
          }
          onSuccess={() => {
            setPostFormProps(null);
          }}
        />
      )}
    </div>
  );
};
