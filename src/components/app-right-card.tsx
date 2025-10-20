/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { MkNotifications, MkNotificationsFilter } from '@/components/infinite-loaders/mk-notifications';
import { MkClock } from '@/components/note/mk-clock';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { NotificationIncludeableType } from '@/lib/notifications';
import { BellIcon } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const AppRightCard = () => {
  const [excluded, setExcluded] = useState<NotificationIncludeableType[]>([]);
  const { t } = useTranslation();

  return (
    <aside className="flex flex-col h-screen gap-2 p-2">
      <div className="bg-background p-2 rounded-lg">
        <MkClock />
      </div>
      <ScrollArea className="flex-[1_1] h-0 bg-background rounded-lg">
        <header className="p-1 sticky top-0 border-b bg-background z-20 flex items-center justify-between">
          <div className="title text-sm flex items-center gap-1 ml-2">
            <BellIcon className="size-4" />
            {t('notifications')}
          </div>
          <MkNotificationsFilter excluded={excluded} setExcluded={setExcluded} />
        </header>
        <MkNotifications excludeTypes={excluded} />
      </ScrollArea>
      {/* TODO: translate this */}
      <footer className="p-2 text-xs text-muted-foreground">
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
