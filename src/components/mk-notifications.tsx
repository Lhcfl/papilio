import { useInfiniteQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { Fragment } from 'react/jsx-runtime';
import { LoadingTrigger } from './loading-trigger';
import { MkNotification } from './mk-notification';
import { Spinner } from './ui/spinner';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { FilterIcon, FilterXIcon, ListChecksIcon, ListXIcon } from 'lucide-react';
import { useAtom, type PrimitiveAtom } from 'jotai';
import { Button } from './ui/button';
import { NOTIFICATION_TYPES, type NotificationIncludeableType } from '@/lib/notifications';
import { MkError } from './mk-error';
import { injectMisskeyApi } from '@/services/inject-misskey-api';
import { registerNote } from '@/hooks/use-note';

export const MkNotifications = (props: {
  excludeTypes?: NotificationIncludeableType[];
  includeTypes?: NotificationIncludeableType[];
}) => {
  const { excludeTypes, includeTypes } = props;

  const { data, hasNextPage, fetchNextPage, isFetchingNextPage, error, refetch } = useInfiniteQuery({
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
              registerNote(n.note);
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
      {isFetchingNextPage && (
        <div className="w-full flex justify-center p-2">
          <Spinner />
        </div>
      )}
      <LoadingTrigger className="w-full h-1" onShow={() => (hasNextPage ? fetchNextPage() : undefined)} />
    </div>
  );
};

export const MkNotificationsFilter = (props: { excludedAtom: PrimitiveAtom<NotificationIncludeableType[]> }) => {
  const { t } = useTranslation();
  const [excluded, setExcluded] = useAtom(props.excludedAtom);
  const hasExcludedAll = excluded.length === NOTIFICATION_TYPES.length;
  const hasIncludedAll = excluded.length === 0;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {hasIncludedAll ? (
          <Button variant="ghost">
            <FilterIcon />
          </Button>
        ) : (
          <Button variant="ghost" className="bg-tertiary/10">
            <FilterXIcon className="text-tertiary" />
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            <div>{t('filter')}</div>
            <div className="text-xs text-muted-foreground">{t('notificationSettingDesc')}</div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {NOTIFICATION_TYPES.map((type) => (
            <DropdownMenuCheckboxItem
              key={type}
              checked={!excluded.includes(type)}
              onSelect={(ev) => ev.preventDefault()}
              onCheckedChange={(checked) =>
                setExcluded((old) => {
                  const set = new Set<NotificationIncludeableType>(old);
                  if (checked) {
                    set.delete(type);
                  } else {
                    set.add(type);
                  }
                  return [...set.values()];
                })
              }
            >
              {t(`_notification._types.${type}`)}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onSelect={(ev) => ev.preventDefault()}
            onClick={() => setExcluded([])}
            disabled={hasIncludedAll}
          >
            <ListChecksIcon />
            {t('enableAll')}
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={(ev) => ev.preventDefault()}
            onClick={() => setExcluded([...NOTIFICATION_TYPES])}
            disabled={hasExcludedAll}
          >
            <ListXIcon />
            {t('disableAll')}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
