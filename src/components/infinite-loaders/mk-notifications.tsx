/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { useTranslation } from 'react-i18next';
import { Fragment } from 'react/jsx-runtime';
import { MkNotification } from '@/components/mk-notification';
import { CheckCheckIcon, FilterIcon, FilterXIcon, ListChecksIcon, ListXIcon, RefreshCwIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NOTIFICATION_TYPES, type NotificationIncludeableType } from '@/lib/notifications';
import { createStreamChannel, misskeyApi } from '@/lib/inject-misskey-api';
import { registerNote } from '@/hooks/use-note';
import { MenuOrDrawer, type Menu, type MenuSwitch } from '@/components/menu-or-drawer';
import { MkInfiniteScrollByData } from '@/components/infinite-loaders/mk-infinite-scroll';
import { infiniteQueryOptions, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { groupNotifications } from '@/lib/notification-grouper';
import { usePreference } from '@/stores/perference';
import { HeaderRightPortal } from '@/components/header-portal';
import { Spinner } from '@/components/ui/spinner';

export const MkNotifications = () => {
  const [excluded, setExcluded] = useState<NotificationIncludeableType[]>([]);
  const grouping = usePreference((p) => p.groupNotifications);
  const { t } = useTranslation();

  const { mutate: markAllAsRead, isPending: isMarkingAllAsRead } = useMutation({
    mutationKey: ['notifications/mark-all-as-read'],
    mutationFn: () => misskeyApi('notifications/mark-all-as-read', {}),
  });

  const opts = infiniteQueryOptions({
    queryKey: ['notifications', excluded],
    queryFn: ({ pageParam: untilId }) =>
      misskeyApi('i/notifications', {
        untilId,
        limit: 99,
        excludeTypes: excluded,
        markAsRead: false,
      }).then((ns) => ({
        id: untilId,
        raw: ns.map((n) => {
          if ('note' in n) {
            registerNote([n.note]);
          }
          return n;
        }),
        grouped: groupNotifications(ns),
      })),
    initialPageParam: 'zzzzzzzzzzzzzzzzzz',
    getNextPageParam: (lastPage) => lastPage.raw.at(-1)?.id,
    staleTime: Infinity,
    refetchOnWindowFocus: 'always',
    refetchOnReconnect: 'always',
  });

  const query = useInfiniteQuery(opts);
  const { refetch, isRefetching } = query;
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = createStreamChannel('main');
    channel.on('notification', (notification) => {
      if ('note' in notification) {
        registerNote([notification.note]);
      }
      const [, excluded] = opts.queryKey;
      if (excluded.includes(notification.type as NotificationIncludeableType)) {
        return;
      }
      queryClient.setQueryData(opts.queryKey, (old) => {
        if (old) {
          const newPages = old.pages.map((page, index) => {
            if (index === 0) {
              const newRaw = [notification, ...page.raw];
              return {
                id: page.id,
                raw: newRaw,
                grouped: groupNotifications(newRaw),
              };
            } else {
              return page;
            }
          });
          if (newPages[0].raw.length > 100) {
            newPages.unshift({
              id: 'zzzzzzzzzzzzzzzzzz',
              raw: [],
              grouped: [],
            });
          }
          return {
            ...old,
            pages: newPages,
          };
        } else {
          return old;
        }
      });
    });
    return () => {
      channel.dispose();
    };
  }, [opts.queryKey, queryClient]);

  return (
    <>
      <HeaderRightPortal>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => {
            markAllAsRead();
          }}
          title={t('markAllAsRead')}
        >
          {isMarkingAllAsRead ? <Spinner /> : <CheckCheckIcon />}
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => {
            void refetch();
          }}
          title={t('reload')}
        >
          <RefreshCwIcon className={isRefetching ? 'animate-spin' : ''} />
        </Button>
        <MkNotificationsFilter excluded={excluded} setExcluded={setExcluded} />
      </HeaderRightPortal>
      <MkInfiniteScrollByData infiniteQueryResult={query}>
        {(page) =>
          (grouping ? page.grouped : page.raw).map((n) => (
            <Fragment key={n.id}>
              <MkNotification notification={n} />
              <hr className="m-auto w-[80%]" />
            </Fragment>
          ))
        }
      </MkInfiniteScrollByData>
    </>
  );
};

export const MkNotificationsFilter = (props: {
  excluded: NotificationIncludeableType[];
  setExcluded: React.Dispatch<React.SetStateAction<NotificationIncludeableType[]>>;
}) => {
  const { t } = useTranslation();
  const { excluded, setExcluded } = props;
  const hasExcludedAll = excluded.length === NOTIFICATION_TYPES.length;
  const hasIncludedAll = excluded.length === 0;

  const menu: Menu = [
    {
      type: 'group',
      id: 'types',
      items: [
        {
          type: 'label',
          id: 'label',
          label: (
            <div>
              <div>{t('filter')}</div>
              <div className="text-muted-foreground text-xs">{t('notificationSettingDesc')}</div>
            </div>
          ),
        },
        null,
        ...NOTIFICATION_TYPES.map(
          (type): MenuSwitch => ({
            type: 'switch',
            id: type,
            label: t(`_notification._types.${type}`),
            value: !excluded.includes(type),
            onChange: (checked) => {
              setExcluded((old) => {
                const set = new Set<NotificationIncludeableType>(old);
                if (checked) {
                  set.delete(type);
                } else {
                  set.add(type);
                }
                return [...set.values()];
              });
            },
          }),
        ),
      ],
    },
    {
      type: 'group',
      id: 'actions',
      items: [
        null,
        {
          type: 'item',
          id: 'enable-all',
          label: t('enableAll'),
          icon: <ListChecksIcon />,
          onClick: () => {
            setExcluded([]);
          },
          disabled: hasIncludedAll,
          preventCloseOnClick: true,
        },
        {
          type: 'item',
          id: 'disable-all',
          label: t('disableAll'),
          icon: <ListXIcon />,
          onClick: () => {
            setExcluded([...NOTIFICATION_TYPES]);
          },
          disabled: hasExcludedAll,
          preventCloseOnClick: true,
        },
      ],
    },
  ];

  return (
    <MenuOrDrawer menu={menu}>
      {hasIncludedAll ? (
        <Button variant="ghost" size="icon-sm" title={t('filter')}>
          <FilterIcon />
        </Button>
      ) : (
        <Button variant="ghost" size="icon-sm" className="bg-tertiary/10" title={t('filter')}>
          <FilterXIcon className="text-tertiary" />
        </Button>
      )}
    </MenuOrDrawer>
  );
};
