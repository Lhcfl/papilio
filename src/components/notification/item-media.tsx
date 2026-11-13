/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { ItemMedia } from '@/ui/item';
import { cn } from '@/lib/utils';
import {
  AtSignIcon,
  BellIcon,
  type LucideIcon,
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

const notificationIcons: Partial<Record<Notification['type'], LucideIcon>> = {
  note: PlusIcon,
  mention: AtSignIcon,
  reply: MessageSquareReplyIcon,
  renote: RepeatIcon,
  quote: QuoteIcon,
  reaction: SmilePlusIcon,
  receiveFollowRequest: UserPlusIcon,
  followRequestAccepted: UserCheckIcon,
  follow: Users2Icon,
  pollEnded: ChartColumnBigIcon,
  scheduledNotePosted: CalendarCheck2Icon,
  scheduledNotePostFailed: CalendarX2Icon,
  roleAssigned: UserRoundPlusIcon,
  chatRoomInvitationReceived: MessageCircleMoreIcon,
  achievementEarned: TrophyIcon,
  exportCompleted: DownloadIcon,
  login: KeyRoundIcon,
  createToken: KeyRoundIcon,
  app: LayoutGridIcon,
  'reaction:grouped': SmilePlusIcon,
  'grouped:reaction': SmilePlusIcon,
  'renote:grouped': RepeatIcon,
  'grouped:renote': RepeatIcon,
  test: FlaskConicalIcon,
  edited: EditIcon,
};

export const NotificationItemIcon = ({ type, className }: { type: Notification['type']; className?: string }) => {
  const Icon = notificationIcons[type] ?? BellIcon;

  return <Icon className={className} />;
};

export const ReactionEmoji = (props: { reaction: string; note: NoteWithExtension }) => (
  <span className="text-primary-foreground bg-secondary/40 absolute right-0 bottom-0 flex size-4 items-center justify-center overflow-hidden rounded-sm p-0.5 backdrop-blur-sm">
    {props.reaction.startsWith(':') ? (
      <MkCustomEmoji name={props.reaction} url={props.note.reactionEmojis[props.reaction]} innerClassName="h-[1em]!" />
    ) : (
      <MkEmoji emoji={props.reaction} innerClassName="h-[1em]!" />
    )}
  </span>
);

export const NotificationItemMedia = (
  props: { notification: FrontendGroupedNotification } & React.ComponentProps<typeof ItemMedia>,
) => {
  const { notification, className, ...mediaProps } = props;

  // V1 compact layout: a small leading glyph instead of the large tile/avatar block.
  if (notification.type === 'reaction') {
    return (
      <ItemMedia {...mediaProps} className={cn('mt-0.5 size-5 shrink-0 items-center justify-center', className)}>
        {notification.reaction.startsWith(':') ? (
          <MkCustomEmoji
            name={notification.reaction}
            url={notification.note.reactionEmojis[notification.reaction]}
            innerClassName="h-4!"
          />
        ) : (
          <MkEmoji emoji={notification.reaction} innerClassName="h-4!" />
        )}
      </ItemMedia>
    );
  }

  return (
    <ItemMedia
      {...mediaProps}
      className={cn('text-muted-foreground mt-0.5 size-5 shrink-0 items-center justify-center', className)}
    >
      <NotificationItemIcon type={notification.type} className="size-[18px]" />
    </ItemMedia>
  );
};
