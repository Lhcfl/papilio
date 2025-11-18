/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { useTranslation } from 'react-i18next';
import { Fragment } from 'react/jsx-runtime';
import { MkNotification } from '@/components/mk-notification';
import { FilterIcon, FilterXIcon, ListChecksIcon, ListXIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NOTIFICATION_TYPES, type NotificationIncludeableType } from '@/lib/notifications';
import { createStreamChannel, misskeyApi } from '@/services/inject-misskey-api';
import { registerNote } from '@/hooks/use-note';
import { MenuOrDrawer, type Menu, type MenuSwitch } from '@/components/menu-or-drawer';
import { MkInfiniteScrollByData } from '@/components/infinite-loaders/mk-infinite-scroll';
import { infiniteQueryOptions, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { groupNotifications } from '@/lib/notification-grouper';
import { usePreference } from '@/stores/perference';

export const MkNotifications = (props: {
  excludeTypes?: NotificationIncludeableType[];
  includeTypes?: NotificationIncludeableType[];
}) => {
  const { excludeTypes, includeTypes } = props;
  const grouping = usePreference((p) => p.groupNotifications);

  const opts = infiniteQueryOptions({
    queryKey: ['notifications', excludeTypes, includeTypes],
    queryFn: ({ pageParam: untilId }) =>
      misskeyApi('i/notifications', {
        untilId,
        limit: 99,
        excludeTypes,
        includeTypes,
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
  });

  const query = useInfiniteQuery(opts);
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = createStreamChannel('main');
    channel.on('notification', (notification) => {
      if ('note' in notification) {
        registerNote([notification.note]);
      }
      const [, excludeTypes, includeTypes] = opts.queryKey;
      if (excludeTypes?.includes(notification.type as NotificationIncludeableType)) {
        return;
      }
      if (includeTypes && !includeTypes.includes(notification.type as NotificationIncludeableType)) {
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
        <Button variant="ghost" size="icon-sm">
          <FilterIcon />
        </Button>
      ) : (
        <Button variant="ghost" size="icon-sm" className="bg-tertiary/10">
          <FilterXIcon className="text-tertiary" />
        </Button>
      )}
    </MenuOrDrawer>
  );
};
