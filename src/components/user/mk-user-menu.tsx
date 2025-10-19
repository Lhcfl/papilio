/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { UserDetailed } from 'misskey-js/entities.js';
import { MenuOrDrawer, type Menu } from '../menu-or-drawer';
import { useMe } from '@/stores/me';
import { useTranslation } from 'react-i18next';
import { copyToClipboard } from '@/lib/utils';
import { acct } from 'misskey-js';
import { getRelativeUrl } from '@/services/inject-misskey-api';
import {
  AtSignIcon,
  BanIcon,
  EditIcon,
  ExternalLinkIcon,
  EyeIcon,
  EyeOffIcon,
  FlagIcon,
  HourglassIcon,
  ListIcon,
  MailIcon,
  PencilIcon,
  SearchIcon,
  UserRoundMinusIcon,
  UserRoundPlusIcon,
  UserRoundXIcon,
} from 'lucide-react';
import { linkOptions } from '@tanstack/react-router';
import { toast } from 'sonner';
import {
  useBlockAction,
  useCancelFollowRequestAction,
  useFollowAction,
  useMuteAction,
  useUnblockAction,
  useUnfollowAction,
  useUnmuteAction,
} from '@/hooks/user-action';
import { useAfterConfirm } from '@/stores/confirm-dialog';
import { MkI18n } from '../mk-i18n';
import { MkUserName } from '../mk-user-name';

export function MkUserMenu({ user, children }: { user: UserDetailed; children: React.ReactNode }) {
  const { t } = useTranslation();
  const meId = useMe((s) => s.id);
  const isMe = user.id === meId;
  const isFollowable = !user.isBlocked;

  function mutateAsync(props: { mutateAsync: (...args: never[]) => Promise<unknown> }) {
    return () => props.mutateAsync().then(() => void null);
  }

  const follow = useAfterConfirm(
    {
      title: t('follow'),
      description: <MkI18n i18nKey="followConfirm" values={{ name: <MkUserName user={user} /> }} />,
      confirmText: `${t('yes')} (${t('follow')}})`,
      confirmIcon: <UserRoundPlusIcon />,
      cancelText: t('cancel'),
    },
    mutateAsync(useFollowAction(user)),
  );

  const unfollow = useAfterConfirm(
    {
      title: t('unfollow'),
      description: <MkI18n i18nKey="unfollowConfirm" values={{ name: <MkUserName user={user} /> }} />,
      confirmText: `${t('yes')} (${t('unfollow')}})`,
      confirmIcon: <UserRoundMinusIcon />,
      cancelText: t('cancel'),
      variant: 'destructive',
    },
    mutateAsync(useUnfollowAction(user)),
  );

  const cancelFollowRequest = useAfterConfirm(
    {
      title: t('unfollow'),
      description: <MkI18n i18nKey="undoFollowRequestConfirm" values={{ name: <MkUserName user={user} /> }} />,
      confirmText: `${t('yes')} (${t('unfollow')}})`,
      confirmIcon: <UserRoundMinusIcon />,
      cancelText: t('cancel'),
    },
    mutateAsync(useCancelFollowRequestAction(user)),
  );

  const breakFollow = useAfterConfirm(
    {
      title: t('breakFollow'),
      description: <MkI18n i18nKey="breakFollowConfirm" values={{ name: <MkUserName user={user} /> }} />,
      confirmText: `${t('yes')} (${t('breakFollow')}})`,
      confirmIcon: <UserRoundXIcon />,
      cancelText: t('cancel'),
      variant: 'destructive',
    },
    mutateAsync(useUnfollowAction(user)),
  );

  const block = useAfterConfirm(
    {
      title: t('block'),
      description: <MkI18n i18nKey="blockConfirm" values={{ name: <MkUserName user={user} /> }} />,
      confirmText: `${t('yes')} (${t('block')}})`,
      confirmIcon: <BanIcon />,
      cancelText: t('cancel'),
      variant: 'destructive',
    },
    mutateAsync(useBlockAction(user)),
  );

  const unblock = useAfterConfirm(
    {
      title: t('unblock'),
      description: <MkI18n i18nKey="unblockConfirm" values={{ name: <MkUserName user={user} /> }} />,
      confirmText: `${t('yes')} (${t('unblock')}})`,
      confirmIcon: <BanIcon />,
      cancelText: t('cancel'),
    },
    mutateAsync(useUnblockAction(user)),
  );

  const { mutate: unmute } = useUnmuteAction(user);
  const { mutate: mute } = useMuteAction(user);

  const menu: Menu = [
    {
      type: 'label',
      id: 'user-menu-label',
      label: t('user'),
    },
    {
      type: 'group',
      id: 'common-actions',
      items: [
        null,
        {
          type: 'item',
          id: 'copy-username',
          icon: <AtSignIcon />,
          label: t('copyUsername'),
          onClick: () => {
            void copyToClipboard('@' + acct.toString(user));
          },
        },
        {
          type: 'item',
          id: 'show-on-remote',
          icon: <ExternalLinkIcon />,
          label: t('showOnRemote'),
          href: user.url ?? getRelativeUrl(`/@${acct.toString(user)}`),
        },
        {
          type: 'item',
          id: 'search-user-notes',
          icon: <SearchIcon />,
          label: t('searchThisUsersNotes'),
          to: linkOptions({
            to: '/search',
          }),
        },
      ],
    },
    {
      type: 'group',
      id: 'user-actions',
      items: [
        null,
        {
          type: 'item',
          id: 'edit-memo',
          icon: <PencilIcon />,
          label: t('editMemo'),
          onClick: () => {
            toast.error('not impl');
          },
        },
        {
          type: 'item',
          id: 'add-to-list',
          icon: <ListIcon />,
          label: t('addToList'),
          onClick: () => {
            toast.error('not impl');
          },
        },
        !isMe && {
          type: 'item',
          id: 'pm',
          icon: <MailIcon />,
          label: t('directMessage'),
          onClick: () => {
            toast.error('not impl');
          },
        },
      ],
    },
    !isMe && {
      type: 'group',
      id: 'follow-actions',
      items: [
        null,
        user.isMuted
          ? {
              type: 'item',
              id: 'unmute-user',
              icon: <EyeIcon />,
              label: t('unmute'),
              onClick: unmute,
            }
          : {
              type: 'item',
              id: 'mute-user',
              icon: <EyeOffIcon />,
              label: t('mute'),
              // TODO: support mute duration selection
              onClick: () => {
                mute(null);
              },
            },
        user.isBlocked
          ? {
              type: 'item',
              id: 'unblock-user',
              icon: <BanIcon />,
              label: t('unblock'),
              onClick: unblock,
            }
          : {
              type: 'item',
              id: 'block-user',
              icon: <BanIcon />,
              label: t('block'),
              onClick: block,
              variant: 'destructive',
            },
        isFollowable &&
          user.isFollowing && {
            type: 'item',
            id: 'unfollow',
            icon: <UserRoundMinusIcon />,
            label: t('unfollow'),
            onClick: unfollow,
          },
        isFollowable &&
          !user.isFollowing &&
          !user.hasPendingFollowRequestFromYou && {
            type: 'item',
            id: 'follow',
            icon: <UserRoundPlusIcon />,
            label: t('follow'),
            onClick: follow,
          },
        isFollowable &&
          !user.isFollowing &&
          user.hasPendingFollowRequestFromYou && {
            type: 'item',
            id: 'cancel-follow-request',
            icon: <HourglassIcon />,
            label: t('followRequestPending'),
            onClick: cancelFollowRequest,
          },
        user.isFollowed && {
          type: 'item',
          id: 'break-follow',
          icon: <UserRoundXIcon />,
          label: t('breakFollow'),
          onClick: breakFollow,
        },
      ],
    },
    !isMe && {
      type: 'group',
      id: 'report-actions',
      items: [
        null,
        {
          type: 'item',
          id: 'report-user',
          icon: <FlagIcon />,
          label: t('reportAbuse'),
          onClick: () => {
            toast.error('not impl');
          },
        },
      ],
    },
    isMe && {
      type: 'group',
      id: 'me-actions',
      items: [
        null,
        {
          type: 'item',
          id: 'edit-profile',
          icon: <EditIcon />,
          label: t('editProfile'),
          to: linkOptions({
            to: '/settings/profile',
          }),
        },
      ],
    },
  ];

  return <MenuOrDrawer menu={menu}>{children}</MenuOrDrawer>;
}
