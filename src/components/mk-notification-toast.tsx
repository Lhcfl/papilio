import clsx from 'clsx'
import {
  AtSignIcon,
  BellIcon,
  CalendarCheck2Icon,
  CalendarX2Icon,
  ChartColumnBigIcon,
  DownloadIcon,
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
} from 'lucide-react'
import type { Notification } from 'misskey-js/entities.js'
import { MkAvatar } from './mk-avatar'
import { MkCustomEmoji, MkEmoji } from './mk-emoji'
import { MkUserName } from './mk-user-name'
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from './ui/item'

export const NotificationMedia = (props: { notification: Notification } & { className?: string }) => {
  const { notification, ...rest } = props

  switch (notification.type) {
    case 'note':
      return <PlusIcon {...rest} />
    case 'mention':
      return <AtSignIcon {...rest} />
    case 'reply':
      return <MessageSquareReplyIcon {...rest} />
    case 'renote':
      return <RepeatIcon {...rest} />
    case 'quote':
      return <QuoteIcon {...rest} />
    case 'reaction': {
      const { className } = rest
      if (notification.reaction.startsWith(':')) {
        const url = notification.note.reactionEmojis[notification.reaction]
        return <MkCustomEmoji name={notification.reaction} url={url} innerClassName={className} {...rest} />
      }
      else {
        return <MkEmoji emoji={notification.reaction} innerClassName={className} {...rest} />
      }
    }
    case 'receiveFollowRequest':
      return <UserPlusIcon {...rest} />
    case 'followRequestAccepted':
      return <UserCheckIcon {...rest} />
    case 'follow':
      return <Users2Icon {...rest} />
    case 'pollEnded':
      return <ChartColumnBigIcon {...rest} />
    case 'scheduledNotePosted':
      return <CalendarCheck2Icon {...rest} />
    case 'scheduledNotePostFailed':
      return <CalendarX2Icon {...rest} />
    case 'roleAssigned':
      return <UserRoundPlusIcon {...rest} />
    case 'chatRoomInvitationReceived':
      return <MessageCircleMoreIcon {...rest} />
    case 'achievementEarned':
      return <TrophyIcon {...rest} />
    case 'exportCompleted':
      return <DownloadIcon {...rest} />
    case 'login':
      return <KeyRoundIcon {...rest} />
    case 'createToken':
      return <KeyRoundIcon {...rest} />
    case 'app':
      return <LayoutGridIcon {...rest} />
    case 'reaction:grouped':
      return <SmilePlusIcon {...rest} />
    case 'renote:grouped':
      return <RepeatIcon {...rest} />
    case 'test':
      return <FlaskConicalIcon {...rest} />
    default:
      return <BellIcon {...rest} />
  }
}

export const NotificationTitle = (props: { notification: Notification }) => {
  const { notification } = props
  const { t } = useTranslation()

  switch (notification.type) {
    case 'note':
      return <MkUserName user={notification.user} />
    case 'mention':
      return <MkUserName user={notification.user} />
    case 'reply':
      return <MkUserName user={notification.user} />
    case 'renote':
      return <MkUserName user={notification.user} />
    case 'quote':
      return <MkUserName user={notification.user} />
    case 'reaction':
      return <MkUserName user={notification.user} />
    case 'receiveFollowRequest':
      return <MkUserName user={notification.user} />
    case 'followRequestAccepted':
      return <MkUserName user={notification.user} />
    case 'follow':
      return <MkUserName user={notification.user} />
    case 'pollEnded':
      return t('_notification._types.pollEnded')
    case 'scheduledNotePosted':
      return t('_notification._types.scheduledNotePosted')
    case 'scheduledNotePostFailed':
      return t('_notification._types.scheduledNotePostFailed')
    case 'roleAssigned':
      return t('_notification._types.roleAssigned')
    case 'chatRoomInvitationReceived':
      return <MkUserName user={notification.invitation.user} />
    case 'achievementEarned':
      return t('_notification._types.achievementEarned')
    case 'exportCompleted':
      return t('_notification._types.exportCompleted')
    case 'login':
      return t('_notification._types.login')
    case 'createToken':
      return t('_notification._types.createToken')
    case 'app':
      return t('_notification._types.app')
    case 'test':
      return t('_notification._types.test')
    default:
      return t('unknown') + ` (${notification.type})`
  }
}

export const NotificationDescription = (props: { notification: Notification }) => {
  const { notification } = props
  const { t } = useTranslation()

  switch (notification.type) {
    case 'note':
      return getNoteExcerpt(notification.note)
    case 'mention':
      return getNoteExcerpt(notification.note)
    case 'reply':
      return getNoteExcerpt(notification.note)
    case 'renote':
      return getNoteExcerpt(notification.note)
    case 'quote':
      return getNoteExcerpt(notification.note)
    case 'reaction':
      return getNoteExcerpt(notification.note)
    case 'receiveFollowRequest':
      return t('receiveFollowRequest')
    case 'followRequestAccepted':
      return t('followRequestAccepted')
    case 'follow':
      return t('followsYou')
    case 'pollEnded':
      return getNoteExcerpt(notification.note)
    case 'scheduledNotePosted':
      return getNoteExcerpt(notification.note)
    case 'scheduledNotePostFailed':
      return getNoteExcerpt(notification.noteDraft)
    case 'roleAssigned':
      return notification.role.name
    case 'chatRoomInvitationReceived':
      return t('_notification.chatRoomInvitationReceived')
    case 'achievementEarned':
      return t(`_achievements._types.${notification.achievement}.title`)
    case 'exportCompleted':
      return t(`_exportOrImport.${notification.exportedEntity}`)
    case 'login':
      return t('_notification.login')
    case 'createToken':
      return t('_notification.createToken')
    case 'app':
      return notification.body
    case 'reaction:grouped':
      return getNoteExcerpt(notification.note)
    case 'renote:grouped':
      return getNoteExcerpt(notification.note)
    case 'test':
      return t('_notification.testNotification')
    default:
      return t('unknown')
  }
}

export const NotificationIconColor = (notification: Pick<Notification, 'type'>) => {
  switch (notification.type) {
    case 'note':
      return 'bg-emerald-500'
    case 'mention':
      return 'bg-sky-500'
    case 'reply':
      return 'bg-amber-500'
    case 'renote':
      return 'bg-violet-500'
    case 'quote':
      return 'bg-rose-500'
    case 'reaction':
      return 'bg-red-400'
    case 'receiveFollowRequest':
      return 'bg-indigo-500'
    case 'followRequestAccepted':
      return 'bg-teal-500'
    case 'follow':
      return 'bg-orange-500'
    case 'pollEnded':
      return 'bg-fuchsia-500'
    case 'scheduledNotePosted':
      return 'bg-pink-400'
    case 'scheduledNotePostFailed':
      return 'bg-red-600'
    case 'roleAssigned':
      return 'bg-cyan-500'
    case 'chatRoomInvitationReceived':
      return 'bg-lime-500'
    case 'achievementEarned':
      return 'bg-yellow-400'
    case 'exportCompleted':
      return 'bg-blue-400'
    case 'login':
      return 'bg-stone-500'
    case 'createToken':
      return 'bg-neutral-500'
    case 'app':
      return 'bg-zinc-500'
    case 'reaction:grouped':
      return 'bg-red-300'
    case 'renote:grouped':
      return 'bg-purple-400'
    case 'test':
      return 'bg-gray-400'
    default:
      return 'bg-primary'
  }
}

export const MkNotificationToast = (props: { notification: Notification }) => {
  const { notification } = props
  return (
    <Item className="w-70 bg-background z-20 shadow-sm" size="sm" variant="outline">
      <div>
        {'user' in notification
          ? (
              <div className="relative">
                <MkAvatar user={notification.user} className="size-11" />
                <span
                  className={clsx(
                    'absolute bottom-0 right-0 text-primary-foreground size-6 rounded-md p-1 flex items-center justify-center',
                    NotificationIconColor(notification),
                  )}
                >
                  <NotificationMedia notification={notification} className="size-4" />
                </span>
              </div>
            )
          : (
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
            )}
      </div>

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
