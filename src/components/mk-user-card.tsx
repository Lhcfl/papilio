/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { UserDetailed } from 'misskey-js/entities.js';
import { MkUserName } from './mk-user-name';
import { acct } from 'misskey-js';
import { MkBlurHash } from './mk-blurhash';
import { Fragment, useState, type HTMLProps } from 'react';
import { cn } from '@/lib/utils';
import { MkAvatar } from './mk-avatar';
import { Button } from './ui/button';
import {
  BanIcon,
  CheckIcon,
  CircleSlashIcon,
  CircleXIcon,
  EditIcon,
  HourglassIcon,
  MessageSquareHeartIcon,
  MinusIcon,
  MoreVerticalIcon,
  PlusIcon,
  UserRoundMinusIcon,
  UserRoundPlusIcon,
  UsersRoundIcon,
  VolumeOffIcon,
  XIcon,
} from 'lucide-react';
import { ButtonGroup } from './ui/button-group';
import { MkMfm } from './mk-mfm';
import { useTranslation } from 'react-i18next';
import { Badge } from './ui/badge';
import {
  useAcceptFollowRequestAction,
  useCancelFollowRequestAction,
  useFollowAction,
  useRejectFollowRequestAction,
  useUnblockAction,
  useUnfollowAction,
} from '@/hooks/user-action';
import { Spinner } from './ui/spinner';
import { MkI18n } from './mk-i18n';
import { Separator } from './ui/separator';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { useAfterConfirm } from '@/stores/confirm-dialog';
import { useErrorDialogs } from '@/stores/error-dialog';
import { errorMessageSafe } from '@/lib/error';
import { useMe } from '@/stores/me';
import { Link } from '@tanstack/react-router';
import { MkUserMenu } from './user/mk-user-menu';
import { Card, CardAction, CardContent, CardTitle } from './ui/card';

export const MkUserCard = (props: { user: UserDetailed } & HTMLProps<HTMLDivElement>) => {
  const { user, className: classNameProps, ...divProps } = props;
  const { t } = useTranslation();
  const meId = useMe((s) => s.id);

  const isNotMe = user.id !== meId;

  // isXXXed means you are XXXed by the user
  // isXXXing means you are XXXing the user
  // e.g. isBlocking means you are blocking the user
  const badges = [
    { condition: user.isFollowed && user.isFollowing, label: t('mutualFollow'), icon: UsersRoundIcon },
    { condition: user.isFollowed && !user.isFollowing, label: t('followsYou'), icon: UserRoundPlusIcon },
    { condition: user.isFollowing && !user.isFollowed, label: t('following'), icon: UserRoundPlusIcon },
    { condition: user.isBlocked, label: t('blockingYou'), icon: CircleXIcon },
    { condition: user.isBlocking, label: t('blocked'), icon: BanIcon },
    { condition: user.isMuted, label: t('mute'), icon: VolumeOffIcon },
  ];

  const { mutate: accept, isPending: isAccepting } = useAcceptFollowRequestAction(user);
  const { mutate: reject, isPending: isRejecting } = useRejectFollowRequestAction(user);

  return (
    <div className={cn('mk-user-card relative @container', classNameProps)} {...divProps}>
      <div className="flex gap-1 absolute top-2 left-2 z-10">
        {badges
          .filter((b) => b.condition)
          .map((badge) => (
            <Badge key={badge.label}>
              <badge.icon />
              {badge.label}
            </Badge>
          ))}
      </div>
      {user.hasPendingFollowRequestToYou && (
        <Card className="flex -col absolute top-2 right-4 z-10 bg-background/50 backdrop-blur-2xl border-none py-2">
          <CardContent className="px-2">
            <CardTitle className="p-2 flex items-center gap-2 font-normal">
              <UserRoundPlusIcon className="size-4" />
              {t('receiveFollowRequest')}
            </CardTitle>
            <CardAction>
              <Button
                size="sm"
                className="mr-2"
                onClick={() => {
                  accept(void null);
                }}
              >
                {isAccepting ? <Spinner /> : <CheckIcon />}
                {t('accept')}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  reject(void null);
                }}
              >
                {isRejecting ? <Spinner /> : <XIcon />}
                {t('reject')}
              </Button>
            </CardAction>
          </CardContent>
        </Card>
      )}
      <MkUserCardBanner url={user.bannerUrl} blurhash={user.bannerBlurhash} className="h-48 @md:h-64" />
      <div className="mt-2 px-2 @md:px-4 @lg:px-6 flex justify-between relative">
        <MkAvatar
          user={user}
          disableRouteLink
          disableHoverCard
          className="-mt-10 @md:-mt-20"
          avatarProps={{ className: 'size-20 @md:size-30 rounded-lg' }}
        />
        <ButtonGroup>
          {isNotMe ? (
            <MkUserFollowButton user={user} />
          ) : (
            <Button asChild>
              <Link to="/settings/profile">
                <EditIcon />
                {t('editProfile')}
              </Link>
            </Button>
          )}
          <MkUserMenu user={user}>
            <Button variant="outline">
              <MoreVerticalIcon />
            </Button>
          </MkUserMenu>
        </ButtonGroup>
      </div>
      <div className="p-2 @md:p-4 @lg:px-6">
        <div>
          <MkUserName user={user} className="font-bold text-lg @md:text-xl" />
          <div className="text-sm text-muted-foreground">@{acct.toString(user)}</div>
        </div>
        {user.followedMessage && (
          <Alert className="bg-muted mt-2">
            <MessageSquareHeartIcon />
            <AlertTitle>{t('messageToFollower')}</AlertTitle>
            <AlertDescription>
              <MkMfm text={user.followedMessage} author={user} emojiUrls={user.emojis} />
            </AlertDescription>
          </Alert>
        )}
        <div className="py-4 text-sm @md:py-2 @md:text-base">
          <MkMfm text={user.description ?? t('noDescription')} author={user} emojiUrls={user.emojis} />
        </div>
        <Separator />
        {user.fields.length > 0 && (
          <div className="user-field mt-2 grid grid-cols-[auto_1fr] text-sm gap-2">
            {user.fields.map((f) => (
              <Fragment key={`${f.name}-${f.value}`}>
                <span className="text-muted-foreground max-w-30 @md:max-w-50 @lg:max-w-70 ">
                  <MkMfm text={f.name} author={user} emojiUrls={user.emojis} />
                </span>
                <span>
                  <MkMfm text={f.value} author={user} emojiUrls={user.emojis} />
                </span>
              </Fragment>
            ))}
          </div>
        )}
        <div className="info mt-2">
          <span className="mr-4">
            <span className="font-bold mr-2">{user.notesCount}</span>
            <span>{t('notes')}</span>
          </span>
          <span className="mr-4">
            <span className="font-bold mr-2">{user.followersCount}</span>
            <span>{t('followers')}</span>
          </span>
          <span>
            <span className="font-bold mr-2">{user.followingCount}</span>
            <span>{t('following')}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

const MkUserFollowButton = (props: { user: UserDetailed }) => {
  const { user } = props;
  const { t } = useTranslation();

  const actions = {
    unfollow: useUnfollowAction(user),
    follow: useFollowAction(user),
    unblock: useUnblockAction(user),
    cancelFollowRequest: useCancelFollowRequestAction(user),
  };

  const loading = Object.values(actions).some((action) => action.isPending);

  const showErrorDialog = useErrorDialogs((s) => s.pushDialog);

  const getKind = () => {
    if (user.hasPendingFollowRequestFromYou) {
      return {
        action: 'cancelFollowRequest' as const,
        icon: HourglassIcon,
        label: t('followRequestPending'),
        actionName: t('unfollow'),
        actionIcon: UserRoundMinusIcon,
        confirm: t('unfollowConfirm'),
      };
    }
    if (user.isFollowing) {
      return {
        action: 'unfollow' as const,
        icon: MinusIcon,
        label: t('unfollow'),
        actionName: t('unfollow'),
        actionIcon: UserRoundMinusIcon,
        confirm: t('unfollowConfirm'),
      };
    }
    if (user.isBlocking) {
      return {
        action: 'unblock' as const,
        icon: BanIcon,
        label: t('blocked'),
        actionName: t('unblock'),
        variant: 'destructive' as const,
        actionIcon: CheckIcon,
        confirm: t('unblockConfirm'),
      };
    }
    if (user.isBlocked) {
      return {
        action: null,
        icon: CircleSlashIcon,
        label: t('follow'),
        btnProps: { disabled: true },
        actionIcon: () => null,
        confirm: null,
      };
    }
    return {
      action: 'follow' as const,
      icon: PlusIcon,
      label: t('follow'),
      actionName: t('follow'),
      actionIcon: UserRoundPlusIcon,
      confirm: t('followConfirm'),
    };
  };

  const { action, actionName, variant, icon: ButtonIcon, actionIcon: ActionIcon, label, confirm } = getKind();

  function handleAction() {
    if (action == null) return;
    actions[action].mutate(void null, {
      onError(error, variables, onMutateResult, context) {
        console.error('Failed to perform user action:', error, variables, onMutateResult, context);
        showErrorDialog({
          title: t('error'),
          description: errorMessageSafe(error),
        });
      },
    });
  }

  const onClick = useAfterConfirm(
    {
      title: actionName,
      description: <MkI18n i18nValue={confirm} values={{ name: <MkUserName user={user} /> }} />,
      confirmText: `${t('yes')} (${actionName})`,
      confirmIcon: <ActionIcon />,
      variant,
      cancelText: t('cancel'),
    },
    () => {
      handleAction();
    },
  );

  return (
    <Button variant={variant} onClick={onClick}>
      {loading ? <Spinner /> : <ButtonIcon />}
      {label}
    </Button>
  );
};

const MkUserCardBanner = (props: { url: string | null; blurhash: string | null } & HTMLProps<HTMLDivElement>) => {
  const { url, blurhash, className, ...rest } = props;
  const [loading, setLoading] = useState(true);

  return (
    <div className={cn('mk-user-card-thumbnail relative w-full', className)} {...rest}>
      {url && (
        <img
          src={url}
          alt="banner"
          loading="lazy"
          className="w-full h-full object-cover"
          onLoad={() => {
            setLoading(false);
          }}
        />
      )}
      {url && loading && blurhash && (
        <MkBlurHash blurhash={blurhash} id={url} className="w-full h-full absolute inset-0" />
      )}
    </div>
  );
};
