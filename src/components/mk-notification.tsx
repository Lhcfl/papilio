import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from './ui/item'
import { NotificationDescription, NotificationIconColor, NotificationMedia, NotificationTitle } from './mk-notification-toast'
import clsx from 'clsx'
import type { Notification } from 'misskey-js/entities.js'
import { MkNote } from './mk-note'
import type { HTMLProps } from 'react'
import { MkAvatar } from './mk-avatar'
import { Button } from './ui/button'
import { ChevronLeftIcon, MoreHorizontalIcon, SmilePlusIcon } from 'lucide-react'
import { MkUserName } from './mk-user-name'
import { MkI18n } from './mk-i18n'
import { MkCustomEmoji, MkEmoji } from './mk-emoji'

type PickNotification<T extends Notification['type']> = Extract<Notification, { type: T }>

export const MkNotification = (props: {
  notification: Notification | { type: '_other' }
} & HTMLProps<HTMLDivElement>,
) => {
  const { notification } = props

  return (
    <div className={clsx('mk-notification', notification.type)}>
      {(() => {
        switch (notification.type) {
          case 'test': return <SimpleNotification notification={notification} />
          case 'note': return <MkNote noteId={notification.note.id} />
          case 'mention': return <MkNote noteId={notification.note.id} />
          case 'reply': return <MkNote noteId={notification.note.id} />
          case 'renote': return <RenoteNotification notification={notification} />
          case 'quote': return <MkNote noteId={notification.note.id} />
          case 'reaction': return <ReactionNotification notification={notification} />
          case 'pollEnded': return <SimpleNotification notification={notification} />
          case 'scheduledNotePosted': return <SimpleNotification notification={notification} />
          case 'scheduledNotePostFailed': return <SimpleNotification notification={notification} />
          case 'follow': return <div>not impl</div>
          case 'receiveFollowRequest': return <div>not impl</div>
          case 'followRequestAccepted': return <div>not impl</div>
          case 'roleAssigned': return <SimpleNotification notification={notification} />
          case 'chatRoomInvitationReceived': return <SimpleNotification notification={notification} />
          case 'achievementEarned': return <SimpleNotification notification={notification} />
          case 'exportCompleted': return <SimpleNotification notification={notification} />
          case 'login': return <SimpleNotification notification={notification} />
          case 'createToken': return <SimpleNotification notification={notification} />
          case 'app': return <SimpleNotification notification={notification} />
          case 'reaction:grouped': return <ReactionNotification notification={notification} />
          case 'renote:grouped': return <RenoteNotification notification={notification} />
          default: return <div>unknown notification</div>
        }
      })()}
    </div>
  )
}

const ReactionNotification = (props: { notification: PickNotification<'reaction' | 'reaction:grouped'> }) => {
  const { notification } = props
  const [expand, setExpand] = useState(false)
  const reacters = notification.type === 'reaction' ? [notification] : notification.reactions
  const reactersLess = reacters.slice(0, 3)
  const hasMore = reacters.length > 3

  const ReactionEmoji = ({ reaction, ...rest }: { reaction: string, innerClassName?: string }) => {
    if (reaction.startsWith(':')) {
      const url = notification.note.reactionEmojis[reaction]
      return <MkCustomEmoji name={reaction} url={url} {...rest} />
    }
    else {
      return <MkEmoji emoji={reaction} {...rest} />
    }
  }

  return (
    <div className="flex p-4 gap-4">
      <div>
        <span
          className={clsx(
            'text-primary-foreground size-11 rounded-md p-1 flex items-center justify-center',
            NotificationIconColor(notification),
          )}
        >
          <SmilePlusIcon className="size-6" />
        </span>
      </div>
      <div>
        <div className="flex flex-wrap gap-2 mt-1">
          {(expand ? reacters : reactersLess).map((r, i) => (
            <div className="reacter relative" key={i}>
              <MkAvatar user={r.user} className="mr-1 size-10" />
              <span className="absolute bottom-0 right-0 w-6 h-6 overflow-hidden bg-primary-foreground rounded-full flex items-center justify-center">
                <ReactionEmoji reaction={r.reaction} innerClassName="h-[1em]!" />
              </span>
            </div>
          ))}
          {hasMore && !expand && (
            <Button
              variant="outline"
              size="icon-lg"
              className="rounded-full"
              onClick={() => setExpand(true)}
            >
              <MoreHorizontalIcon />
            </Button>
          )}
          {hasMore && expand && (
            <Button
              variant="outline"
              size="icon-lg"
              className="rounded-full"
              onClick={() => setExpand(false)}
            >
              <ChevronLeftIcon />
            </Button>
          )}
        </div>
        <div className="line-clamp-2 text-sm text-muted-foreground mt-2">
          {getNoteExcerpt(notification.note)}
        </div>
      </div>
    </div>
  )
}

const RenoteNotification = (props: {
  notification: PickNotification<'renote' | 'renote:grouped'>
}) => {
  const { notification } = props
  const { t } = useTranslation()
  const [expand, setExpand] = useState(false)
  const renoters = notification.type === 'renote' ? [notification.user] : notification.users
  const renotersLess = renoters.slice(0, 3)
  const hasMore = renoters.length > 3

  return (
    <div className="flex p-4 gap-4">
      <div>
        <span
          className={clsx(
            'text-primary-foreground size-11 rounded-md p-1 flex items-center justify-center',
            NotificationIconColor(notification),
          )}
        >
          <NotificationMedia notification={notification} className="size-6" />
        </span>
      </div>
      <div>
        <div className="text-sm line-clamp-1">
          <MkI18n
            i18nKey="renotedBy"
            values={{
              user:
              hasMore
                ? (
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
                  )
                : renotersLess.map((u, i) => [
                    <span key={u.id}>
                      {i > 0 && ', '}
                      <MkUserName user={u} />
                    </span>,
                  ]),
            }}
          />
        </div>
        <div className="flex flex-wrap gap-2 mt-1">
          {(expand ? renoters : renotersLess).map(u => <MkAvatar key={u.id} user={u} className="mr-1 size-10" />)}
          {hasMore && !expand && (
            <Button
              variant="outline"
              size="icon-lg"
              className="rounded-full"
              onClick={() => setExpand(true)}
            >
              <MoreHorizontalIcon />
            </Button>
          )}
          {hasMore && expand && (
            <Button
              variant="outline"
              size="icon-lg"
              className="rounded-full"
              onClick={() => setExpand(false)}
            >
              <ChevronLeftIcon />
            </Button>
          )}
        </div>
        <div className="line-clamp-2 text-sm text-muted-foreground mt-2">
          {getNoteExcerpt(notification.note)}
        </div>
      </div>
    </div>
  )
}

const SimpleNotification = (props: { notification: Notification }) => {
  const { notification } = props
  return (
    <Item>
      <ItemMedia>
        <span
          className={clsx(
            'text-primary-foreground size-11 rounded-md p-1 flex items-center justify-center',
            NotificationIconColor(notification),
          )}
        >
          <NotificationMedia notification={notification} className="size-6" />
        </span>
      </ItemMedia>

      <ItemContent>
        <ItemTitle className="line-clamp-1">
          <NotificationTitle notification={notification} />
        </ItemTitle>
        <ItemDescription className="line-clamp-2">
          <NotificationDescription notification={notification} />
        </ItemDescription>
      </ItemContent>
    </Item>
  )
}
