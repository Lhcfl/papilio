/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { SidebarMenuButton } from '@/ui/sidebar';
import { Link, useRouterState } from '@tanstack/react-router';
import { cn } from '@/lib/utils';
import type { ComponentProps } from 'react';

/**
 * Compact sidebar rows: 40px height, 14px labels, 18px icons, 10px radius.
 * Importants are needed because `SidebarMenuButton` ships with its own defaults.
 */
const MENU_ITEM_CLASS = 'h-10 w-full gap-2.5! rounded-[10px]! pr-3 pl-[15px] text-sm! [&_svg]:size-[18px]!';

/**
 * Highlight the nav item for the current route. `/` only matches exactly, every
 * other entry also matches its subroutes (e.g. `/settings/notes` → Settings).
 */
function useIsActiveLink(to: string | undefined) {
  return useRouterState({
    select: (state) => {
      if (!to) return false;
      const pathname = state.location.pathname;
      if (to === '/') return pathname === '/';
      const base = to.endsWith('/') ? to.slice(0, -1) : to;
      return pathname === base || pathname.startsWith(`${base}/`);
    },
  });
}

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
  const isActive = useIsActiveLink(linkOptions.to);

  return (
    <SidebarMenuButton
      isActive={isActive}
      aria-current={isActive ? 'page' : undefined}
      className={MENU_ITEM_CLASS}
      tooltip={title}
      render={<Link {...linkOptions}/>}
    >
        {icon}
        {title}
        {count != null && count > 0 && (
          <>
            <span className='count bg-primary text-secondary rounded-sm px-1.5 py-0.5 text-xs group-data-[state="collapsed"]:hidden'>
              {count}
            </span>
            <span className='count bg-primary text-secondary absolute top-0.5 right-0.5 hidden rounded-sm px-1 py-0.5 text-[7px] group-data-[state="collapsed"]:block'>
              {count}
            </span>
          </>
        )}
        {ding && (
          <span className='ding bg-primary size-2 rounded-full group-data-[state="collapsed"]:absolute group-data-[state="collapsed"]:top-1 group-data-[state="collapsed"]:right-1 group-data-[state="collapsed"]:size-1' />
        )}
      
    </SidebarMenuButton>
  );
}

export function AppSidebarMenuButton({
  icon,
  title,
  className,
  ...props
}: { icon: React.ReactNode; title: string } & ComponentProps<typeof SidebarMenuButton>) {
  return (
    <SidebarMenuButton className={cn(MENU_ITEM_CLASS, className)} tooltip={title} {...props}>
      {icon}
      {title}
    </SidebarMenuButton>
  );
}
