import { useInfiniteQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Fragment } from 'react/jsx-runtime';
import { LoadingTrigger } from './loading-trigger';
import { MkNotification } from './mk-notification';
import { Spinner } from './ui/spinner';
import { FilterIcon, FilterXIcon, ListChecksIcon, ListXIcon } from 'lucide-react';
import { useAtom, type PrimitiveAtom } from 'jotai';
import { Button } from './ui/button';
import { NOTIFICATION_TYPES, type NotificationIncludeableType } from '@/lib/notifications';
import { MkError } from './mk-error';
import { injectMisskeyApi } from '@/services/inject-misskey-api';
import { registerNote } from '@/hooks/use-note';
import { MenuOrDrawer, type Menu, type MenuSwitch } from './menu-or-drawer';

export const MkNotifications = (props: {
  excludeTypes?: NotificationIncludeableType[];
  includeTypes?: NotificationIncludeableType[];
}) => {
  const { excludeTypes, includeTypes } = props;

  const { data, hasNextPage, fetchNextPage, isFetchingNextPage, isPending, error, refetch } = useInfiniteQuery({
    queryKey: ['notifications', excludeTypes, includeTypes],
    queryFn: ({ pageParam: untilId }) =>
      injectMisskeyApi()
        .request('i/notifications-grouped', {
          untilId,
          limit: 30,
          excludeTypes,
          includeTypes,
        })
        .then((ns) =>
          ns.map((n) => {
            if ('note' in n) {
              registerNote([n.note]);
            }
            return n;
          }),
        ),
    initialPageParam: 'zzzzzzzzzzzzzzzzzz',
    getNextPageParam: (lastPage) => lastPage.at(-1)?.id,
  });

  const notifications = data?.pages.flat();

  return (
    <div className="mk-notifications">
      {notifications?.map((n) => (
        <Fragment key={n.id}>
          <MkNotification notification={n} />
          <hr className="w-[80%] m-auto" />
        </Fragment>
      ))}
      {error && <MkError error={error} retry={refetch} />}
      {(isPending || isFetchingNextPage) && (
        <div className="w-full flex justify-center p-6">
          <Spinner />
        </div>
      )}
      <LoadingTrigger className="w-full h-1" onShow={() => (hasNextPage ? fetchNextPage() : undefined)} />
    </div>
  );
};

export const MkNotificationsFilter = (props: { excludedAtom: PrimitiveAtom<NotificationIncludeableType[]> }) => {
  const { t } = useTranslation();
  const [excludes, setExcluded] = useAtom(props.excludedAtom);
  const hasExcludedAll = excludes.length === NOTIFICATION_TYPES.length;
  const hasIncludedAll = excludes.length === 0;

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
              <div className="text-xs text-muted-foreground">{t('notificationSettingDesc')}</div>
            </div>
          ),
        },
        null,
        ...NOTIFICATION_TYPES.map(
          (type): MenuSwitch => ({
            type: 'switch',
            id: type,
            label: t(`_notification._types.${type}`),
            value: !excludes.includes(type),
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
        <Button variant="ghost">
          <FilterIcon />
        </Button>
      ) : (
        <Button variant="ghost" className="bg-tertiary/10">
          <FilterXIcon className="text-tertiary" />
        </Button>
      )}
    </MenuOrDrawer>
  );
};
