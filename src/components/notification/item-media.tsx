/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { ItemMedia } from '@/components/ui/item';
import { MkAvatar } from '@/components/mk-avatar';
import clsx from 'clsx';
import {
  AtSignIcon,
  BellIcon,
  CalendarCheck2Icon,
  CalendarX2Icon,
  ChartColumnBigIcon,
  DownloadIcon,
  EditIcon,
  FlaskConicalIcon,
  KeyRoundIcon,
  LayoutGridIcon,
  MessageCircleMoreIcon,
  MessageSquareReplyIcon,
  PlusIcon,
  QuoteIcon,
  RepeatIcon,
  SmilePlusIcon,
  TrophyIcon,
  UserCheckIcon,
  UserPlusIcon,
  UserRoundPlusIcon,
  Users2Icon,
} from 'lucide-react';
import { MkCustomEmoji, MkEmoji } from '@/components/mk-emoji';
import type { NoteWithExtension } from '@/types/note';
import type { FrontendGroupedNotification } from '@/lib/notification-grouper';

type Notification = FrontendGroupedNotification;

export const NotificationItemIcon = (type: Notification['type']) => {
  switch (type) {
    case 'note':
      return PlusIcon;
    case 'mention':
      return AtSignIcon;
    case 'reply':
      return MessageSquareReplyIcon;
    case 'renote':
      return RepeatIcon;
    case 'quote':
      return QuoteIcon;
    case 'reaction':
      return SmilePlusIcon;
    case 'receiveFollowRequest':
      return UserPlusIcon;
    case 'followRequestAccepted':
      return UserCheckIcon;
    case 'follow':
      return Users2Icon;
    case 'pollEnded':
      return ChartColumnBigIcon;
    case 'scheduledNotePosted':
      return CalendarCheck2Icon;
    case 'scheduledNotePostFailed':
      return CalendarX2Icon;
    case 'roleAssigned':
      return UserRoundPlusIcon;
    case 'chatRoomInvitationReceived':
      return MessageCircleMoreIcon;
    case 'achievementEarned':
      return TrophyIcon;
    case 'exportCompleted':
      return DownloadIcon;
    case 'login':
      return KeyRoundIcon;
    case 'createToken':
      return KeyRoundIcon;
    case 'app':
      return LayoutGridIcon;
    case 'reaction:grouped':
    case 'grouped:reaction':
      return SmilePlusIcon;
    case 'renote:grouped':
    case 'grouped:renote':
      return RepeatIcon;
    case 'test':
      return FlaskConicalIcon;
    case 'edited':
      return EditIcon;
    default:
      return BellIcon;
  }
};

const NotificationIconColor = (type: Notification['type']) => {
  switch (type) {
    case 'note':
      return 'bg-emerald-500';
    case 'mention':
      return 'bg-sky-500';
    case 'reply':
      return 'bg-amber-500';
    case 'renote':
      return 'bg-violet-500';
    case 'quote':
      return 'bg-rose-500';
    case 'reaction':
      return 'bg-red-400';
    case 'receiveFollowRequest':
      return 'bg-indigo-500';
    case 'followRequestAccepted':
      return 'bg-teal-500';
    case 'follow':
      return 'bg-orange-500';
    case 'pollEnded':
      return 'bg-fuchsia-500';
    case 'scheduledNotePosted':
      return 'bg-pink-400';
    case 'scheduledNotePostFailed':
      return 'bg-red-600';
    case 'roleAssigned':
      return 'bg-cyan-500';
    case 'chatRoomInvitationReceived':
      return 'bg-lime-500';
    case 'achievementEarned':
      return 'bg-yellow-400';
    case 'exportCompleted':
      return 'bg-blue-400';
    case 'login':
      return 'bg-stone-500';
    case 'createToken':
      return 'bg-neutral-500';
    case 'app':
      return 'bg-zinc-500';
    case 'reaction:grouped':
    case 'grouped:reaction':
      return 'bg-red-300';
    case 'renote:grouped':
    case 'grouped:renote':
      return 'bg-purple-400';
    case 'test':
      return 'bg-gray-400';
    case 'edited':
      return 'bg-yellow-600';
    default:
      return 'bg-primary';
  }
};

export const ReactionEmoji = (props: { reaction: string; note: NoteWithExtension }) => (
  <span className="text-primary-foreground bg-secondary/40 absolute right-0 bottom-0 flex size-6 items-center justify-center overflow-hidden rounded-sm p-0.5 backdrop-blur-sm">
    {props.reaction.startsWith(':') ? (
      <MkCustomEmoji
        name={props.reaction}
        url={props.note.reactionEmojis[props.reaction]}
        innerClassName="h-[1.2em]!"
      />
    ) : (
      <MkEmoji emoji={props.reaction} innerClassName="h-[1.2em]!" />
    )}
  </span>
);

export const NotificationItemMedia = (
  props: { notification: FrontendGroupedNotification } & React.ComponentProps<typeof ItemMedia>,
) => {
  const { notification, ...mediaProps } = props;
  const ItemIcon = NotificationItemIcon(notification.type);

  switch (notification.type) {
    case 'follow':
    case 'receiveFollowRequest':
    case 'followRequestAccepted':
    case 'renote':
    case 'edited':
      return (
        <ItemMedia {...mediaProps}>
          <div className="relative">
            <MkAvatar user={notification.user} avatarProps={{ className: 'size-11 rounded-md' }} />
            <span
              className={clsx(
                'text-primary-foreground absolute right-0 bottom-0 flex size-6 items-center justify-center rounded-sm p-1',
                NotificationIconColor(notification.type),
              )}
            >
              <ItemIcon />
            </span>
          </div>
        </ItemMedia>
      );
    case 'reaction': {
      return (
        <ItemMedia {...mediaProps}>
          <div className="relative">
            <MkAvatar user={notification.user} avatarProps={{ className: 'size-11 rounded-md' }} />
            <ReactionEmoji reaction={notification.reaction} note={notification.note} />
          </div>
        </ItemMedia>
      );
    }
  }

  return (
    <ItemMedia {...mediaProps}>
      <span
        className={clsx(
          'text-primary-foreground flex size-11 items-center justify-center rounded-md p-1',
          NotificationIconColor(notification.type),
        )}
      >
        <ItemIcon className="size-6" />
      </span>
    </ItemMedia>
  );
};
