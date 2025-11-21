/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { SidebarMenuButton } from '@/components/ui/sidebar';
import { Link } from '@tanstack/react-router';
import type { ComponentProps } from 'react';

export function AppSidebarMenuButtonLink({
  icon,
  title,
  ding,
  count,
  linkOptions,
}: {
  icon: React.ReactNode;
  title: string;
  ding?: boolean;
  count?: number;
  linkOptions: ComponentProps<typeof Link>;
}) {
  return (
    <SidebarMenuButton asChild className="h-12 w-full" tooltip={title}>
      <Link {...linkOptions}>
        {icon}
        {title}
        {count != null && count > 0 && (
          <>
            <span className='count bg-tertiary text-secondary rounded-sm px-1.5 py-0.5 text-xs group-data-[state="collapsed"]:hidden'>
              {count}
            </span>
            <span className='count bg-tertiary text-secondary absolute top-0.5 right-0.5 hidden rounded-sm px-1 py-0.5 text-[7px] group-data-[state="collapsed"]:block'>
              {count}
            </span>
          </>
        )}
        {ding && (
          <span className='ding bg-tertiary size-2 rounded-full group-data-[state="collapsed"]:absolute group-data-[state="collapsed"]:top-1 group-data-[state="collapsed"]:right-1 group-data-[state="collapsed"]:size-1' />
        )}
      </Link>
    </SidebarMenuButton>
  );
}

export function AppSidebarMenuButton({
  icon,
  title,
  ...props
}: { icon: React.ReactNode; title: string } & ComponentProps<typeof SidebarMenuButton>) {
  return (
    <SidebarMenuButton className="h-12" tooltip={title} {...props}>
      {icon}
      {title}
    </SidebarMenuButton>
  );
}
