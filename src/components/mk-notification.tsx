/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item';
import clsx from 'clsx';
import type { Notification } from 'misskey-js/entities.js';
import { MkNote } from '@/components/mk-note';
import type { HTMLProps } from 'react';
import { MkAvatar } from '@/components/mk-avatar';
import { Button } from '@/components/ui/button';
import { CheckIcon, ChevronLeftIcon, UserRoundPlusIcon, XIcon } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { NotificationItemMedia, ReactionEmoji } from '@/components/notification/item-media';
import { NotificationDescription, NotificationTitle } from '@/components/notification/item-text';
import { useUserQuery } from '@/hooks/user';
import { useAcceptFollowRequestAction, useFollowAction, useRejectFollowRequestAction } from '@/hooks/user-action';
import type { FrontendGroupedNotification } from '@/lib/notification-grouper';
import { MkTime } from '@/components/mk-time';

type PickNotification<T extends FrontendGroupedNotification['type']> = Extract<
  FrontendGroupedNotification,
  { type: T }
>;

export const MkNotification = (
  props: {
    notification: FrontendGroupedNotification;
  } & HTMLProps<HTMLDivElement>,
) => {
  const { notification } = props;

  return (
    <div className={clsx('mk-notification', notification.type)}>
      {(() => {
        switch (notification.type) {
          case 'test':
            return <SimpleNotification notification={notification} />;
          case 'note':
            return <MkNote noteId={notification.note.id} showReply />;
          case 'mention':
            return <MkNote noteId={notification.note.id} showReply />;
          case 'reply':
            return <MkNote noteId={notification.note.id} showReply />;
          case 'renote':
            return <SimpleNotification notification={notification} />;
          case 'quote':
            return <MkNote noteId={notification.note.id} showReply />;
          case 'reaction':
            return <SimpleNotification notification={notification} />;
          case 'pollEnded':
            return <SimpleNotification notification={notification} />;
          case 'scheduledNotePosted':
            return <SimpleNotification notification={notification} />;
          case 'scheduledNotePostFailed':
            return <SimpleNotification notification={notification} />;
          case 'follow':
            return <FollowNotification notification={notification} />;
          case 'receiveFollowRequest':
            return <ReceiveFollowRequestNotification notification={notification} />;
          case 'followRequestAccepted':
            return <SimpleNotification notification={notification} />;
          case 'roleAssigned':
            return <SimpleNotification notification={notification} />;
          case 'chatRoomInvitationReceived':
            return <SimpleNotification notification={notification} />;
          case 'achievementEarned':
            return <SimpleNotification notification={notification} />;
          case 'exportCompleted':
            return <SimpleNotification notification={notification} />;
          case 'login':
            return <SimpleNotification notification={notification} />;
          case 'createToken':
            return <SimpleNotification notification={notification} />;
          case 'app':
            return <SimpleNotification notification={notification} />;
          case 'grouped:reaction':
            return <ExpandableNotification notification={notification} />;
          case 'grouped:renote':
            return <ExpandableNotification notification={notification} />;
          default:
            return <SimpleNotification notification={notification as unknown as Notification} />;
        }
      })()}
    </div>
  );
};

const FollowNotification = (props: { notification: PickNotification<'follow'> }) => {
  const { notification } = props;
  const { t } = useTranslation();
  const { data: user, refetch } = useUserQuery(notification.user.id);
  const { mutate: follow, isPending: isFollowing } = useFollowAction(notification.user);
  const didNotFollowBack = user != null && !user.isFollowing && !user.hasPendingFollowRequestFromYou;

  return (
    <Item>
      <NotificationItemMedia notification={notification} />
      <ItemContent>
        <ItemTitle className="line-clamp-1 flex w-full justify-between">
          <NotificationTitle notification={notification} />
          <MkTime time={notification.createdAt} className="text-muted-foreground" />
        </ItemTitle>
        <div className="text-muted-foreground line-clamp-2 text-sm wrap-break-word">
          <NotificationDescription notification={notification} />
        </div>
        {didNotFollowBack && (
          <ItemActions>
            <Button
              variant="outline"
              onClick={() => {
                follow(void null, { onSuccess: () => refetch() });
              }}
            >
              {isFollowing ? <Spinner /> : <UserRoundPlusIcon />} {t('follow')}
            </Button>
          </ItemActions>
        )}
      </ItemContent>
    </Item>
  );
};

const ReceiveFollowRequestNotification = (props: { notification: PickNotification<'receiveFollowRequest'> }) => {
  const { notification } = props;
  const { t } = useTranslation();
  const [hidden, setHidden] = useState(false);
  const { data: user } = useUserQuery(notification.user.id);
  const { mutate: accept, isPending: isAccepting } = useAcceptFollowRequestAction(notification.user);
  const { mutate: reject, isPending: isRejecting } = useRejectFollowRequestAction(notification.user);

  return (
    <Item>
      <NotificationItemMedia notification={notification} />
      <ItemContent>
        <ItemTitle className="line-clamp-1 flex w-full justify-between">
          <NotificationTitle notification={notification} />
          <MkTime time={notification.createdAt} className="text-muted-foreground" />
        </ItemTitle>
        <ItemDescription className="line-clamp-2">{t('_notification.youReceivedFollowRequest')}</ItemDescription>
        {/* here we need a === false, because user may be null (loading), which we don't want to hide the action */}
        <ItemActions hidden={hidden || user?.hasPendingFollowRequestToYou === false} className="mt-1">
          <Button
            variant="outline"
            onClick={() => {
              accept(void null, {
                onSuccess: () => {
                  setHidden(true);
                },
              });
            }}
          >
            {isAccepting ? <Spinner /> : <CheckIcon />} {t('accept')}
          </Button>
          <Button
            variant="outline"
            className="text-destructive!"
            onClick={() => {
              reject(void null, {
                onSuccess: () => {
                  setHidden(true);
                },
              });
            }}
          >
            {isRejecting ? <Spinner /> : <XIcon />} {t('reject')}
          </Button>
        </ItemActions>
      </ItemContent>
    </Item>
  );
};

function ExpandableNotification(props: { notification: PickNotification<'grouped:reaction' | 'grouped:renote'> }) {
  const { notification } = props;
  const [expand, setExpand] = useState(false);
  const ns = notification.grouped;
  const nsLess = ns.slice(0, 3);
  const hasMore = ns.length > 3;

  return (
    <Item className="items-start">
      <NotificationItemMedia notification={notification} className="items-start" />
      <ItemContent>
        <div className="mt-1 flex flex-wrap gap-2">
          {(expand ? ns : nsLess).map((n) => {
            switch (n.type) {
              case 'reaction':
                return (
                  <div className="reacter relative" key={n.id}>
                    <MkAvatar user={n.user} avatarProps={{ className: 'mr-1 size-10' }} />
                    <ReactionEmoji reaction={n.reaction} note={notification.note} />
                  </div>
                );
              case 'renote':
                return <MkAvatar key={n.id} user={n.user} avatarProps={{ className: 'mr-1 size-10' }} />;
            }
          })}
          {hasMore && !expand && (
            <Button
              variant="outline"
              size="icon-lg"
              className="text-muted-foreground! rounded-full text-xs"
              onClick={() => {
                setExpand(true);
              }}
            >
              +{ns.length - 3}
            </Button>
          )}
          {hasMore && expand && (
            <Button
              variant="outline"
              size="icon-lg"
              className="rounded-full"
              onClick={() => {
                setExpand(false);
              }}
            >
              <ChevronLeftIcon />
            </Button>
          )}
        </div>
        <div className="text-muted-foreground mt-2 line-clamp-2 text-sm">
          <NotificationDescription notification={notification} />
        </div>
      </ItemContent>
      <ItemContent>
        <MkTime time={notification.createdAt} className="text-muted-foreground" />
      </ItemContent>
    </Item>
  );
}

export const SimpleNotification = (props: { notification: Notification } & React.ComponentProps<typeof Item>) => {
  const { notification, ...itemProps } = props;
  return (
    <Item {...itemProps}>
      <NotificationItemMedia notification={notification} />
      <ItemContent className="w-0 flex-[1_1]">
        <ItemTitle className="w-full">
          <div className="line-clamp-1 w-0 flex-[1_1]">
            <NotificationTitle notification={notification} />
          </div>
          <div className="text-muted-foreground">
            <MkTime time={notification.createdAt} />
          </div>
        </ItemTitle>
        <div className="text-muted-foreground line-clamp-2 text-sm wrap-break-word">
          <NotificationDescription notification={notification} />
        </div>
      </ItemContent>
    </Item>
  );
};
