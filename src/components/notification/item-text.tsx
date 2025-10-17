import { useTranslation } from 'react-i18next';

import type { Notification } from 'misskey-js/entities.js';
import { MkUserName } from '../mk-user-name';
import { getNoteExcerpt } from '@/services/note-excerpt';
import { Link } from '@tanstack/react-router';
import { MkMfm } from '../mk-mfm';

export const NotificationDescription = (props: { notification: Notification }) => {
  const { notification } = props;
  const { t } = useTranslation();

  switch (notification.type) {
    case 'note':
    case 'mention':
    case 'reply':
    case 'quote':
    case 'reaction':
    case 'reaction:grouped':
      return (
        <Link to="/notes/$id" params={{ id: notification.note.id }}>
          <MkMfm text={getNoteExcerpt(notification.note)} inline />
        </Link>
      );
    case 'renote':
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
      return t(`_achievements._types.${notification.achievement}.title`);
    case 'exportCompleted':
      return t(`_exportOrImport.${notification.exportedEntity}`);
    case 'login':
      return t('_notification.login');
    case 'createToken':
      return t('_notification.createToken');
    case 'app':
      return notification.body;
    case 'renote:grouped':
      return getNoteExcerpt(notification.note);
    case 'test':
      return t('_notification.testNotification');
    default:
      return t('unknown');
  }
};

export const NotificationTitle = (props: { notification: Notification }) => {
  const { notification } = props;
  const { t } = useTranslation();

  switch (notification.type) {
    case 'note':
      return <MkUserName user={notification.user} />;
    case 'mention':
      return <MkUserName user={notification.user} />;
    case 'reply':
      return <MkUserName user={notification.user} />;
    case 'renote':
      return <MkUserName user={notification.user} />;
    case 'quote':
      return <MkUserName user={notification.user} />;
    case 'reaction':
      return <MkUserName user={notification.user} />;
    case 'receiveFollowRequest':
      return <MkUserName user={notification.user} />;
    case 'followRequestAccepted':
      return <MkUserName user={notification.user} />;
    case 'follow':
      return <MkUserName user={notification.user} />;
    case 'pollEnded':
      return t('_notification._types.pollEnded');
    case 'scheduledNotePosted':
      return t('_notification._types.scheduledNotePosted');
    case 'scheduledNotePostFailed':
      return t('_notification._types.scheduledNotePostFailed');
    case 'roleAssigned':
      return t('_notification._types.roleAssigned');
    case 'chatRoomInvitationReceived':
      return <MkUserName user={notification.invitation.user} />;
    case 'achievementEarned':
      return t('_notification._types.achievementEarned');
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
    default:
      return t('unknown') + ` (${notification.type})`;
  }
};
