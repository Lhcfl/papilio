/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { MkPostFormDialog } from '@/components/mk-post-form-dialog';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { Link } from '@tanstack/react-router';
import { BellIcon, HomeIcon, PencilIcon } from 'lucide-react';
import type { HTMLProps } from 'react';

export function AppNavBar({ className, ...props }: HTMLProps<HTMLDivElement>) {
  return (
    <nav className={cn('flex w-full gap-2 border-t p-2', className)} {...props}>
      <SidebarTrigger className="h-10 flex-1/4" variant="secondary" />
      <Button variant="secondary" className="h-10 flex-1/4" asChild>
        <Link to="/">
          <HomeIcon />
        </Link>
      </Button>
      <Button variant="secondary" className="h-10 flex-1/4" asChild>
        <Link to="/my/notifications">
          <BellIcon />
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
