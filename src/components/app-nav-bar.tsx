/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { MkPostFormDialog } from '@/components/mk-post-form-dialog';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { unreadNotificationsAtom } from '@/stores/unread-notifications';
import { Link } from '@tanstack/react-router';
import { useAtomValue } from 'jotai';
import { BellIcon, HomeIcon, PencilIcon } from 'lucide-react';
import type { HTMLProps } from 'react';

export function AppNavBar({ className, ...props }: HTMLProps<HTMLDivElement>) {
  const unreadNotificationsCount = useAtomValue(unreadNotificationsAtom);

  return (
    <nav className={cn('flex w-full gap-2 border-t p-2', className)} {...props}>
      <SidebarTrigger className="h-10 flex-1/4" variant="secondary" />
      <Button variant="secondary" className="h-10 flex-1/4" asChild>
        <Link to="/">
          <HomeIcon />
        </Link>
      </Button>
      <Button variant="secondary" className="relative h-10 flex-1/4" asChild>
        <Link to="/my/notifications">
          <BellIcon />
          {unreadNotificationsCount > 0 && (
            <span className="bg-tertiary text-secondary absolute right-1/2 left-1/2 flex w-fit translate-x-2.5 -translate-y-1.5 justify-center rounded-sm px-1.5 py-0.5 text-xs">
              {unreadNotificationsCount}
            </span>
          )}
        </Link>
      </Button>
      <MkPostFormDialog>
        <Button variant="default" className="h-10 flex-1/4">
          <PencilIcon />
        </Button>
      </MkPostFormDialog>
    </nav>
  );
}
