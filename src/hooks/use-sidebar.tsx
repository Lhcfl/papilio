import { useMe } from '@/stores/me';
import { unreadNotificationsAtom } from '@/stores/unread-notifications';
import { linkOptions } from '@tanstack/react-router';
import { useAtomValue } from 'jotai';
import { useTranslation } from 'react-i18next';
import {
  BellIcon,
  CloudIcon,
  CogIcon,
  HomeIcon,
  MegaphoneIcon,
  MessageSquareIcon,
  SearchIcon,
  StarIcon,
  UserPlusIcon,
} from 'lucide-react';

export function useSidebarItems() {
  const { t } = useTranslation();
  const unreadNotificationsCount = useAtomValue(unreadNotificationsAtom);

  return linkOptions([
    { title: t('home'), icon: HomeIcon, to: '/' },
    { title: t('notifications'), icon: BellIcon, to: '/my/notifications', count: unreadNotificationsCount },
    { title: t('favorites'), icon: StarIcon, to: '/my/favorites' },
    { title: t('clips'), icon: StarIcon, to: '/my/clips' },
    {
      title: t('followRequests'),
      icon: UserPlusIcon,
      to: '/my/follow-requests',
      ding: useMe((me) => me.hasPendingReceivedFollowRequest),
    },
    { title: t('announcements'), icon: MegaphoneIcon, to: '/announcements' },
    { title: t('chat'), icon: MessageSquareIcon, to: '/chat' },
    { title: t('drive'), icon: CloudIcon, to: '/my/drive' },
    { title: t('search'), icon: SearchIcon, to: '/search' },
    { title: t('settings'), icon: CogIcon, to: '/settings' },
  ]);
}
