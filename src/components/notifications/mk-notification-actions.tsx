/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { MenuOrDrawer, type Menu, type MenuSwitch } from '@/components/menu-or-drawer';
import { useMarkAllAsReadAction } from '@/hooks/notifications';
import { NOTIFICATION_TYPES, type NotificationIncludeableType } from '@/lib/notifications';
import { Button } from '@/ui/button';
import { Spinner } from '@/ui/spinner';
import { useIsFetching, useQueryClient } from '@tanstack/react-query';
import { CheckCheckIcon, FilterIcon, FilterXIcon, ListChecksIcon, ListXIcon, RefreshCwIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/** Header actions of a notifications window. */
export const MkNotificationActions = ({
  exclude,
  onExcludeChange,
}: {
  exclude: NotificationIncludeableType[];
  onExcludeChange: (exclude: NotificationIncludeableType[]) => void;
}) => {
  const { t } = useTranslation();
  const { mutate: markAllAsRead, isPending: isMarkingAllAsRead } = useMarkAllAsReadAction();
  const queryClient = useQueryClient();
  const isRefetching = useIsFetching({ queryKey: ['notifications'] }) > 0;

  return (
    <>
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
          void queryClient.invalidateQueries({ queryKey: ['notifications'] });
        }}
        title={t('reload')}
      >
        <RefreshCwIcon className={isRefetching ? 'animate-spin' : ''} />
      </Button>
      <MkNotificationFilter exclude={exclude} onChange={onExcludeChange} />
    </>
  );
};

const MkNotificationFilter = ({
  exclude,
  onChange,
}: {
  exclude: NotificationIncludeableType[];
  onChange: (exclude: NotificationIncludeableType[]) => void;
}) => {
  const { t } = useTranslation();
  const hasExcludedAll = exclude.length === NOTIFICATION_TYPES.length;
  const hasIncludedAll = exclude.length === 0;

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
            value: !exclude.includes(type),
            onChange: (checked) => {
              const set = new Set(exclude);
              if (checked) {
                set.delete(type);
              } else {
                set.add(type);
              }
              onChange([...set.values()]);
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
            onChange([]);
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
            onChange([...NOTIFICATION_TYPES]);
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
        <Button variant="ghost" size="icon-sm" className="bg-primary/10" title={t('filter')}>
          <FilterXIcon className="text-primary" />
        </Button>
      )}
    </MenuOrDrawer>
  );
};
