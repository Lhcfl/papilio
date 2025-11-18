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
import { CheckIcon, ChevronLeftIcon, MoreHorizontalIcon, UserRoundPlusIcon, XIcon } from 'lucide-react';
import { MkUserName } from '@/components/mk-user-name';
import { MkI18n } from '@/components/mk-i18n';
import { Spinner } from '@/components/ui/spinner';
import { Tooltip, TooltipContent } from '@/components/ui/tooltip';
import { TooltipTrigger } from '@radix-ui/react-tooltip';
import { NotificationItemMedia, ReactionEmoji } from '@/components/notification/item-media';
import { NotificationDescription, NotificationTitle } from '@/components/notification/item-text';
import { useUserQuery } from '@/hooks/use-user';
import { useAcceptFollowRequestAction, useFollowAction, useRejectFollowRequestAction } from '@/hooks/user-action';
import type { FrontendGroupedNotification } from '@/lib/notification-grouper';

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
            return <ReactionNotification notification={notification} />;
          case 'grouped:renote':
            return <RenoteNotification notification={notification} />;
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
        <ItemTitle className="line-clamp-1">
          <NotificationTitle notification={notification} />
        </ItemTitle>
        <div className="text-muted-foreground line-clamp-2 text-sm wrap-break-word">
          <NotificationDescription notification={notification} />
        </div>
      </ItemContent>
      {didNotFollowBack && (
        <ItemActions>
          <Tooltip>
            <TooltipContent>{t('follow')}</TooltipContent>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  follow(void null, { onSuccess: () => refetch() });
                }}
              >
                {isFollowing ? <Spinner /> : <UserRoundPlusIcon />}
              </Button>
            </TooltipTrigger>
          </Tooltip>
        </ItemActions>
      )}
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
        <ItemTitle className="line-clamp-1">
          <MkUserName user={notification.user} />
        </ItemTitle>
        <ItemDescription className="line-clamp-2 text-xs">
          {t('_notification.youReceivedFollowRequest')}
        </ItemDescription>
      </ItemContent>
      {/* here we need a === false, because user may be null (loading), which we don't want to hide the action */}
      <ItemActions hidden={hidden || user?.hasPendingFollowRequestToYou === false}>
        <Tooltip>
          <TooltipContent>{t('accept')}</TooltipContent>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                accept(void null, {
                  onSuccess: () => {
                    setHidden(true);
                  },
                });
              }}
            >
              {isAccepting ? <Spinner /> : <CheckIcon />}
            </Button>
          </TooltipTrigger>
        </Tooltip>
        <Tooltip>
          <TooltipContent>{t('reject')}</TooltipContent>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                reject(void null, {
                  onSuccess: () => {
                    setHidden(true);
                  },
                });
              }}
            >
              {isRejecting ? <Spinner /> : <XIcon className="text-destructive!" />}
            </Button>
          </TooltipTrigger>
        </Tooltip>
      </ItemActions>
    </Item>
  );
};

const ReactionNotification = (props: { notification: PickNotification<'reaction' | 'grouped:reaction'> }) => {
  const { notification } = props;
  const [expand, setExpand] = useState(false);
  const ns = notification.type === 'reaction' ? [notification] : notification.grouped;
  const nsLess = ns.slice(0, 3);
  const hasMore = ns.length > 3;

  return (
    <Item className="items-start">
      <NotificationItemMedia notification={notification} className="items-start" />
      <ItemContent>
        <div className="mt-1 flex flex-wrap gap-2">
          {(expand ? ns : nsLess).map((r) => (
            <div className="reacter relative" key={r.id}>
              <MkAvatar user={r.user} avatarProps={{ className: 'mr-1 size-10' }} />
              <ReactionEmoji reaction={r.reaction} note={notification.note} />
            </div>
          ))}
          {hasMore && !expand && (
            <Button
              variant="outline"
              size="icon-lg"
              className="rounded-full"
              onClick={() => {
                setExpand(true);
              }}
            >
              <MoreHorizontalIcon />
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
    </Item>
  );
};

const RenoteNotification = (props: { notification: PickNotification<'renote' | 'grouped:renote'> }) => {
  const { notification } = props;
  const { t } = useTranslation();
  const [expand, setExpand] = useState(false);
  const ns = notification.type === 'renote' ? [notification] : notification.grouped;
  const nsLess = ns.slice(0, 3);
  const hasMore = ns.length > 3;

  return (
    <Item className="items-start">
      <NotificationItemMedia notification={notification} className="items-start" />
      <ItemContent>
        <div className="line-clamp-1 text-sm">
          <MkI18n
            i18nKey="renotedBy"
            values={{
              user: hasMore ? (
                <span>
                  <span>{`${ns.length} ${t('users')}: `}</span>
                  {nsLess.map((u, i) => [
                    <span key={u.id}>
                      {i > 0 && ', '}
                      <MkUserName user={u.user} />
                    </span>,
                  ])}
                  ...
                </span>
              ) : (
                nsLess.map((u, i) => [
                  <span key={u.id}>
                    {i > 0 && ', '}
                    <MkUserName user={u.user} />
                  </span>,
                ])
              ),
            }}
          />
        </div>
        <div className="mt-1 flex flex-wrap gap-2">
          {(expand ? ns : nsLess).map((u) => (
            <MkAvatar key={u.id} user={u.user} avatarProps={{ className: 'mr-1 size-10' }} />
          ))}
          {hasMore && !expand && (
            <Button
              variant="outline"
              size="icon-lg"
              className="rounded-full"
              onClick={() => {
                setExpand(true);
              }}
            >
              <MoreHorizontalIcon />
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
    </Item>
  );
};

export const SimpleNotification = (props: { notification: Notification } & React.ComponentProps<typeof Item>) => {
  const { notification, ...itemProps } = props;
  return (
    <Item {...itemProps}>
      <NotificationItemMedia notification={notification} />
      <ItemContent className="w-0 flex-[1_1]">
        <ItemTitle className="line-clamp-1">
          <NotificationTitle notification={notification} />
        </ItemTitle>
        <div className="text-muted-foreground line-clamp-2 text-sm wrap-break-word">
          <NotificationDescription notification={notification} />
        </div>
      </ItemContent>
    </Item>
  );
};
