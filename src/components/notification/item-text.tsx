/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { useTranslation } from 'react-i18next';
import { MkAvatar } from '@/components/mk-avatar';
import { MkUserName } from '@/components/mk-user-name';
import type { User } from '@/types/user';
import { getNoteExcerpt } from '@/lib/note-excerpt';
import { Link } from '@tanstack/react-router';
import { MkMfm } from '@/components/mk-mfm';
import type { FrontendGroupedNotification } from '@/lib/notification-grouper';

/** Compact actor line: 18px avatar + name, used by the notification list. */
const Actor = ({ user, children }: { user: User; children: React.ReactNode }) => (
  <span className="inline-flex min-w-0 items-center gap-1.5">
    <MkAvatar user={user} avatarProps={{ className: 'size-8 shrink-0' }} />
    <span className="truncate">{children}</span>
  </span>
);

export const NotificationDescription = (props: { notification: FrontendGroupedNotification }) => {
  const { notification } = props;
  const { t } = useTranslation();

  switch (notification.type) {
    case 'note':
    case 'mention':
    case 'reply':
    case 'quote':
    case 'reaction':
    case 'grouped:reaction':
    case 'reaction:grouped':
      return (
        <Link to="/notes/$id" params={{ id: notification.note.id }}>
          <MkMfm text={getNoteExcerpt(notification.note)} inline />
        </Link>
      );
    case 'grouped:renote':
    case 'renote':
    case 'renote:grouped':
      return (
        <Link to="/notes/$id" params={{ id: notification.note.renoteId! }}>
          <MkMfm text={getNoteExcerpt(notification.note.renote!)} inline />
        </Link>
      );
    case 'receiveFollowRequest':
      return t('receiveFollowRequest');
    case 'followRequestAccepted':
      return t('followRequestAccepted');
    case 'follow':
      return t('followsYou');
    case 'pollEnded':
      return getNoteExcerpt(notification.note);
    case 'scheduledNotePosted':
      return getNoteExcerpt(notification.note);
    case 'scheduledNotePostFailed':
      return getNoteExcerpt(notification.noteDraft);
    case 'roleAssigned':
      return notification.role.name;
    case 'chatRoomInvitationReceived':
      return t('_notification.chatRoomInvitationReceived');
    case 'achievementEarned':
      return t(`_achievements._types._${notification.achievement}.description`);
    case 'exportCompleted':
      return t(`_exportOrImport.${notification.exportedEntity}`);
    case 'login':
      return t('_notification.login');
    case 'createToken':
      return t('_notification.createToken');
    case 'app':
      return notification.body;
    case 'test':
      return t('_notification.testNotification');
    case 'edited':
      return getNoteExcerpt(notification.note);
    default:
      return t('unknown');
  }
};

export const NotificationTitle = (props: { notification: FrontendGroupedNotification }) => {
  const { notification } = props;
  const { t } = useTranslation();

  switch (notification.type) {
    case 'note':
      return <Actor user={notification.user}><MkUserName user={notification.user} /></Actor>;
    case 'mention':
      return <Actor user={notification.user}><MkUserName user={notification.user} /></Actor>;
    case 'reply':
      return <Actor user={notification.user}><MkUserName user={notification.user} /></Actor>;
    case 'renote':
      return <Actor user={notification.user}><MkUserName user={notification.user} /></Actor>;
    case 'quote':
      return <Actor user={notification.user}><MkUserName user={notification.user} /></Actor>;
    case 'reaction':
      return <Actor user={notification.user}><MkUserName user={notification.user} /></Actor>;
    case 'receiveFollowRequest':
      return <Actor user={notification.user}><MkUserName user={notification.user} /></Actor>;
    case 'followRequestAccepted':
      return <Actor user={notification.user}><MkUserName user={notification.user} /></Actor>;
    case 'follow':
      return <Actor user={notification.user}><MkUserName user={notification.user} /></Actor>;
    case 'pollEnded':
      return t('_notification._types.pollEnded');
    case 'scheduledNotePosted':
      return t('_notification._types.scheduledNotePosted');
    case 'scheduledNotePostFailed':
      return t('_notification._types.scheduledNotePostFailed');
    case 'roleAssigned':
      return t('_notification._types.roleAssigned');
    case 'chatRoomInvitationReceived':
      return <Actor user={notification.invitation.user}><MkUserName user={notification.invitation.user} /></Actor>;
    case 'achievementEarned':
      return t(`_achievements._types._${notification.achievement}.title`);
    case 'exportCompleted':
      return t('_notification._types.exportCompleted');
    case 'login':
      return t('_notification._types.login');
    case 'createToken':
      return t('_notification._types.createToken');
    case 'app':
      return t('_notification._types.app');
    case 'test':
      return t('_notification._types.test');
    case 'edited':
      return t('_notification.edited');
    default:
      return t('unknown') + ` (${notification.type})`;
  }
};
