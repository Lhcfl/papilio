/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { MkClock } from '@/components/mk-clock';
import { site, token } from '@/lib/inject-misskey-api';
import { cn } from '@/lib/utils';
import { NotificationsWindow } from '@/windows/notifications-window';
import { type HTMLProps } from 'react';

export const AppRightCard = ({ className, ...props }: HTMLProps<HTMLDivElement>) => {
  const isLoggedIn = site != null && token != null;

  return (
    <aside className={cn('flex flex-col gap-2 p-2', className)} {...props}>
      <div className="bg-sidebar rounded-lg p-2">
        <MkClock />
      </div>
      {isLoggedIn && (
        <NotificationsWindow />
      )}
      {/* TODO: translate this */}
      <footer className="text-muted-foreground p-2 text-xs">
        <p>
          <a href={__APP_REPO__} className="hover:underline">
            Papilio
          </a>{' '}
          是以 AGPL-3.0 发布的自由软件。构建于 {new Date(__APP_BUILD_DATE__).toLocaleDateString()}{' '}
          <a href={__APP_REPO__ + '/commit/' + __APP_COMMIT_HASH__} className="hover:underline">
            ({__APP_COMMIT_HASH__})
          </a>
        </p>
      </footer>
    </aside>
  );
};
