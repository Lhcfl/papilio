import { Item } from '@radix-ui/react-dropdown-menu'
import type { FetchedNotification } from './mk-notifications'
import { ItemContent, ItemDescription, ItemMedia, ItemTitle } from './ui/item'
import { NotificationDescription, NotificationIconColor, NotificationMedia, NotificationTitle } from './mk-notification-toast'
import clsx from 'clsx'
import type { Notification } from 'misskey-js/entities.js'
import { MkNote } from './mk-note'

export const MkNotification = (props: { notification: FetchedNotification }) => {
  const { notification } = props

  switch (notification.type) {
    case 'test': return <SimpleNotification notification={notification} />
    case 'note': return <div>not impl</div>
    case 'mention': return <div className="mk-notification note"><MkNote noteId={notification.note.id} /></div>
    case 'reply':return <div className="mk-notification note"><MkNote noteId={notification.note.id} /></div>
    case 'renote':return <div className="not impl" />
    case 'quote':return <div className="mk-notification note"><MkNote noteId={notification.note.id} /></div>
    case 'reaction':return <div>not impl</div>
    case 'pollEnded':return <div>not impl</div>
    case 'scheduledNotePosted': return <SimpleNotification notification={notification} />
    case 'scheduledNotePostFailed':return <SimpleNotification notification={notification} />
    case 'follow':return <div>not impl</div>
    case 'receiveFollowRequest':return <div>not impl</div>
    case 'followRequestAccepted':return <div>not impl</div>
    case 'roleAssigned':return <SimpleNotification notification={notification} />
    case 'chatRoomInvitationReceived':return <SimpleNotification notification={notification} />
    case 'achievementEarned':return <SimpleNotification notification={notification} />
    case 'exportCompleted':return <SimpleNotification notification={notification} />
    case 'login':return <SimpleNotification notification={notification} />
    case 'createToken':return <SimpleNotification notification={notification} />
    case 'app':return <SimpleNotification notification={notification} />
    case 'reaction:grouped':return <div>not impl</div>
    case 'renote:grouped':return <div>not impl</div>
  }
}

const SimpleNotification = (props: { notification: Notification }) => {
  const { notification } = props
  return (
    <Item className="mk-notification simple">
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
