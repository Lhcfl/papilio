import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from './ui/item';
import clsx from 'clsx';
import type { Notification } from 'misskey-js/entities.js';
import { MkNote } from './mk-note';
import type { HTMLProps } from 'react';
import { MkAvatar } from './mk-avatar';
import { Button } from './ui/button';
import { CheckIcon, ChevronLeftIcon, MoreHorizontalIcon, UserRoundPlusIcon, XIcon } from 'lucide-react';
import { MkUserName } from './mk-user-name';
import { MkI18n } from './mk-i18n';
import { Spinner } from './ui/spinner';
import { Tooltip, TooltipContent } from './ui/tooltip';
import { TooltipTrigger } from '@radix-ui/react-tooltip';
import { NotificationItemMedia, ReactionEmoji } from './notification/item-media';
import { NotificationDescription, NotificationTitle } from './notification/item-text';
import { useUserQuery } from '@/hooks/use-user';
import { useAcceptFollowRequestAction, useFollowAction, useRejectFollowRequestAction } from '@/hooks/user-action';
import { getNoteExcerpt } from '@/services/note-excerpt';
import { MkMfm } from './mk-mfm';

type PickNotification<T extends Notification['type']> = Extract<Notification, { type: T }>;

export const MkNotification = (
  props: {
    notification: Notification | { type: '_other' };
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
          case 'reaction:grouped':
            return <ReactionNotification notification={notification} />;
          case 'renote:grouped':
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
        <div className="line-clamp-2 text-sm break-all text-muted-foreground">
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
      <ItemActions hidden={hidden}>
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

const ReactionNotification = (props: { notification: PickNotification<'reaction' | 'reaction:grouped'> }) => {
  const { notification } = props;
  const [expand, setExpand] = useState(false);
  const reacters = notification.type === 'reaction' ? [notification] : notification.reactions;
  const reactersLess = reacters.slice(0, 3);
  const hasMore = reacters.length > 3;

  return (
    <Item className="items-start">
      <NotificationItemMedia notification={notification} className="items-start" />
      <ItemContent>
        <div className="flex flex-wrap gap-2 mt-1">
          {(expand ? reacters : reactersLess).map((r, i) => (
            // It's misskey API design that there's no ID for each reaction.
            // But for some times, the same user can react with the same emoji to one note.
            // We just can't distinguish them.
            // So here we use index as part of key.
            // eslint-disable-next-line react-x/no-array-index-key
            <div className="reacter relative" key={i}>
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
        <div className="line-clamp-2 text-sm text-muted-foreground mt-2">
          <MkMfm text={getNoteExcerpt(notification.note)} inline />
        </div>
      </ItemContent>
    </Item>
  );
};

const RenoteNotification = (props: { notification: PickNotification<'renote' | 'renote:grouped'> }) => {
  const { notification } = props;
  const { t } = useTranslation();
  const [expand, setExpand] = useState(false);
  const renoters = notification.type === 'renote' ? [notification.user] : notification.users;
  const renotersLess = renoters.slice(0, 3);
  const hasMore = renoters.length > 3;

  return (
    <Item className="items-start">
      <NotificationItemMedia notification={notification} className="items-start" />
      <ItemContent>
        <div className="text-sm line-clamp-1">
          <MkI18n
            i18nKey="renotedBy"
            values={{
              user: hasMore ? (
                <span>
                  <span>{`${renoters.length} ${t('users')}: `}</span>
                  {renotersLess.map((u, i) => [
                    <span key={u.id}>
                      {i > 0 && ', '}
                      <MkUserName user={u} />
                    </span>,
                  ])}
                  ...
                </span>
              ) : (
                renotersLess.map((u, i) => [
                  <span key={u.id}>
                    {i > 0 && ', '}
                    <MkUserName user={u} />
                  </span>,
                ])
              ),
            }}
          />
        </div>
        <div className="flex flex-wrap gap-2 mt-1">
          {(expand ? renoters : renotersLess).map((u) => (
            <MkAvatar key={u.id} user={u} avatarProps={{ className: 'mr-1 size-10' }} />
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
        <div className="line-clamp-2 text-sm text-muted-foreground mt-2">
          <MkMfm text={getNoteExcerpt(notification.note.renote!)} inline />
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
      <ItemContent>
        <ItemTitle className="line-clamp-1">
          <NotificationTitle notification={notification} />
        </ItemTitle>
        <div className="line-clamp-2 text-sm break-all text-muted-foreground">
          <NotificationDescription notification={notification} />
        </div>
      </ItemContent>
    </Item>
  );
};
