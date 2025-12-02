/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { UserDetailed } from '@/types/user';
import { MkUserName } from '@/components/mk-user-name';
import { acct } from 'misskey-js';
import { Fragment, type HTMLProps } from 'react';
import { cn } from '@/lib/utils';
import { MkAvatar } from '@/components/mk-avatar';
import { Button } from '@/components/ui/button';
import {
  CalendarDaysIcon,
  CheckIcon,
  EditIcon,
  LockIcon,
  MapPinIcon,
  MessageSquareHeartIcon,
  MoreVerticalIcon,
  UserRoundPlusIcon,
  XIcon,
} from 'lucide-react';
import { ButtonGroup } from '@/components/ui/button-group';
import { MkMfm } from '@/components/mk-mfm';
import { useTranslation } from 'react-i18next';
import { useAcceptFollowRequestAction, useRejectFollowRequestAction } from '@/hooks/user-action';
import { Spinner } from '@/components/ui/spinner';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useMe } from '@/stores/me';
import { Link } from '@tanstack/react-router';
import { MkUserMenu } from '@/components/user/mk-user-menu';
import { Card, CardAction, CardContent, CardTitle } from '@/components/ui/card';
import { MkTime } from '@/components/mk-time';
import { MkUserCardBanner } from '@/components/user/mk-user-card-banner';
import { MkUserBadges } from '@/components/user/mk-user-badges';
import { MkUserCardButton } from '@/components/user/mk-user-card-button';

export const MkUserCard = (props: { user: UserDetailed } & HTMLProps<HTMLDivElement>) => {
  const { user, className: classNameProps, ...divProps } = props;
  const { t } = useTranslation();
  const meId = useMe((s) => s.id);
  const isNotMe = user.id !== meId;

  const { mutate: accept, isPending: isAccepting } = useAcceptFollowRequestAction(user);
  const { mutate: reject, isPending: isRejecting } = useRejectFollowRequestAction(user);

  return (
    <div className={cn('mk-user-card @container relative', classNameProps)} {...divProps}>
      <div className="absolute top-2 left-2 z-10 flex gap-1">
        <MkUserBadges user={user} />
      </div>
      {user.hasPendingFollowRequestToYou && (
        <Card className="-col bg-background/50 absolute top-2 right-4 z-10 flex border-none py-2 backdrop-blur-2xl">
          <CardContent className="px-2">
            <CardTitle className="flex items-center gap-2 p-2 font-normal">
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
      <div className="relative mt-2 flex justify-between px-4 @lg:px-6">
        <MkAvatar
          user={user}
          disableRouteLink
          disableHoverCard
          className="-mt-10 @md:-mt-20"
          avatarProps={{ className: 'size-20 @md:size-30 rounded-lg' }}
        />
        <ButtonGroup>
          {isNotMe ? (
            <MkUserCardButton user={user} />
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
      <div className="p-4 @lg:px-6">
        <div>
          <MkUserName user={user} className="text-lg font-bold @md:text-xl" />
          <div className="text-muted-foreground text-sm">
            @{acct.toString(user)}
            {user.isLocked && <LockIcon className="ml-1 inline size-3" aria-label={t('isLocked')} />}
          </div>
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
        {user.fields.length > 0 && <Separator />}
        {user.fields.length > 0 && (
          <div className="user-field mt-2 grid grid-cols-[auto_1fr] gap-2 text-sm">
            {user.fields.map((f) => (
              <Fragment key={`${f.name}-${f.value}`}>
                <span className="text-muted-foreground max-w-30 @md:max-w-50 @lg:max-w-70">
                  <MkMfm text={f.name} author={user} emojiUrls={user.emojis} />
                </span>
                <span>
                  <MkMfm text={f.value} author={user} emojiUrls={user.emojis} />
                </span>
              </Fragment>
            ))}
          </div>
        )}
        <Separator className="mt-2" />
        <div className="mt-2 grid grid-cols-[auto_1fr] gap-2 text-sm">
          <UserCardInfoLine icon={<CalendarDaysIcon className="size-4" />} label={t('registeredDate')}>
            <MkTime time={user.createdAt} mode="detail" colored={false} />
          </UserCardInfoLine>
          {user.birthday && (
            <UserCardInfoLine icon={<EditIcon className="size-4" />} label={t('birthday')}>
              {user.birthday}
            </UserCardInfoLine>
          )}
          {user.location && (
            <UserCardInfoLine icon={<MapPinIcon className="size-4" />} label={t('location')}>
              {user.location}
            </UserCardInfoLine>
          )}
        </div>
        <div className="info mt-2">
          <span className="mr-4">
            <span className="mr-2 font-bold">{user.notesCount}</span>
            <span>{t('notes')}</span>
          </span>
          <span className="mr-4">
            <span className="mr-2 font-bold">{user.followersCount}</span>
            <span>{t('followers')}</span>
          </span>
          <span>
            <span className="mr-2 font-bold">{user.followingCount}</span>
            <span>{t('following')}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

function UserCardInfoLine({
  icon,
  label,
  children,
}: {
  icon?: React.ReactNode;
  label: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <>
      <span className="text-muted-foreground flex items-center gap-1">
        {icon}
        {label}
      </span>
      <span>{children}</span>
    </>
  );
}
