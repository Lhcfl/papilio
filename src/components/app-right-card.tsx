/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { MkNotifications, MkNotificationsFilter } from '@/components/infinite-loaders/mk-notifications';
import { MkClock } from '@/components/mk-clock';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { NotificationIncludeableType } from '@/lib/notifications';
import { cn } from '@/lib/utils';
import { BellIcon } from 'lucide-react';
import { useState, type HTMLProps } from 'react';
import { useTranslation } from 'react-i18next';

export const AppRightCard = ({ className, ...props }: HTMLProps<HTMLDivElement>) => {
  const [excluded, setExcluded] = useState<NotificationIncludeableType[]>([]);
  const { t } = useTranslation();

  return (
    <aside className={cn('flex flex-col gap-2 p-2', className)} {...props}>
      <div className="bg-background rounded-lg p-2">
        <MkClock />
      </div>
      <ScrollArea className="bg-background h-0 flex-[1_1] rounded-lg">
        <header className="bg-background sticky top-0 z-20 flex items-center justify-between border-b p-1">
          <div className="title ml-2 flex items-center gap-1 text-sm">
            <BellIcon className="size-4" />
            {t('notifications')}
          </div>
          <MkNotificationsFilter excluded={excluded} setExcluded={setExcluded} />
        </header>
        <MkNotifications excludeTypes={excluded} />
      </ScrollArea>
      {/* TODO: translate this */}
      <footer className="text-muted-foreground p-2 text-xs">
        <p>
          <a href={__APP_REPO__} className="hover:underline">
            Papilio
          </a>{' '}
          是以 AGPL-3.0 发布的自由软件。
        </p>
        <p>欢迎前往仓库提出 Issue 或者贡献代码。</p>
      </footer>
    </aside>
  );
};
