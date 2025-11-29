/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { MkInfiniteScrollByData } from '@/components/infinite-loaders/mk-infinite-scroll';
import type { Announcement } from 'misskey-js/entities.js';
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item';
import { MkMfm } from '@/components/mk-mfm';
import {
  CheckCircle,
  CheckIcon,
  ClockIcon,
  InfoIcon,
  MailOpenIcon,
  MessageCircleWarningIcon,
  XCircleIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { infiniteQueryOptions, useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { INITIAL_UNTIL_ID, misskeyApi } from '@/lib/inject-misskey-api';
import { Spinner } from '@/components/ui/spinner';
import { MkTime } from '@/components/mk-time';

const POSSIBLE_TYPE = ['current', 'previous'] as const;
type PossibleType = (typeof POSSIBLE_TYPE)[number];

const getAnnouncementQueryOptions = (type: PossibleType) =>
  infiniteQueryOptions({
    queryKey: ['announcements', type],
    queryFn: ({ pageParam }) =>
      misskeyApi('announcements', {
        untilId: pageParam,
        isActive: type === 'current',
      }),
    initialPageParam: INITIAL_UNTIL_ID,
    getNextPageParam: (lastPage) => lastPage.at(-1)?.id,
  });

export function AnnouncementsList(props: { value: PossibleType }) {
  const query = useInfiniteQuery(getAnnouncementQueryOptions(props.value));

  return (
    <MkInfiniteScrollByData infiniteQueryResult={query}>
      {(item) => <MkAnnouncement item={item} />}
    </MkInfiniteScrollByData>
  );
}

function MkAnnouncement(props: { item: Announcement }) {
  const { item } = props;
  const { t } = useTranslation();

  const { mutate: read, isPending } = useMutation({
    mutationKey: ['read-announcement', item.id],
    mutationFn: () => misskeyApi('i/read-announcement', { announcementId: item.id }),
    onSuccess: (_0, _1, _2, ctx) => {
      POSSIBLE_TYPE.forEach((type) => {
        ctx.client.setQueryData(getAnnouncementQueryOptions(type).queryKey, (data) => {
          if (data == null) return data;
          return {
            ...data,
            pages: data.pages.map((page) =>
              page.map((announcement) => {
                if (announcement.id === item.id) {
                  return { ...announcement, isRead: true };
                }
                return announcement;
              }),
            ),
          };
        });
      });
    },
  });

  return (
    <Item variant="outline" className="items-baseline">
      <div className="-mt-2 translate-y-2">
        <ItemMedia variant="icon">
          {item.icon == 'info' && <InfoIcon />}
          {item.icon == 'error' && <XCircleIcon />}
          {item.icon == 'success' && <CheckCircle />}
          {item.icon == 'warning' && <MessageCircleWarningIcon />}
        </ItemMedia>
      </div>
      <ItemContent>
        <ItemTitle className="text-base">{item.title}</ItemTitle>
        <ItemDescription>
          <MkTime time={item.createdAt} mode="detail" prepend={<ClockIcon className="size-4" />} />
        </ItemDescription>
        <div>
          <MkMfm text={item.text} />
        </div>
      </ItemContent>
      {!item.isRead && (
        <ItemActions>
          <Button
            type="button"
            title={t('gotIt')}
            variant={item.needConfirmationToRead ? 'default' : 'outline'}
            onClick={() => {
              read();
            }}
          >
            {isPending ? <Spinner /> : item.needConfirmationToRead ? <CheckIcon /> : <MailOpenIcon />}
          </Button>
        </ItemActions>
      )}
    </Item>
  );
}
