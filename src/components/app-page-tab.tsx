/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { HeaderCenterPortal } from '@/components/header-portal';
import { cn } from '@/lib/utils';
import { PageTabContext } from '@/providers/page-tab-provider';
import { type FileRoutesByFullPath } from '@/routeTree.gen';
import { useMatches, useNavigate } from '@tanstack/react-router';
import { useAtom } from 'jotai';
import { use } from 'react';

export function AppPageTabList({ children }: { children: React.ReactNode[] }) {
  return (
    <HeaderCenterPortal>
      {children.length > 0 && <div className="bg-muted flex items-center rounded-lg p-1">{children}</div>}
    </HeaderCenterPortal>
  );
}

type SlashRemoved<P extends string> = P extends '/' ? P : P extends `${infer R}/` ? R : P;

function removeLastSlash<P extends string>(path: P): SlashRemoved<P> {
  if (path.length > 1 && path.endsWith('/')) {
    return path.slice(0, -1) as SlashRemoved<P>;
  }
  return path as SlashRemoved<P>;
}

export function AppPageTab({
  value,
  label,
  icon,
  children,
}: {
  value: keyof FileRoutesByFullPath;
  label: string;
  icon: React.ReactNode;
  children?: React.ReactNode;
}) {
  const [currentTabValue, setCurrentTabValue] = useAtom(use(PageTabContext));
  const lastMatchedLocationFullPath = useMatches({
    select: (match) => match.at(-1)?.fullPath,
  });
  const navigate = useNavigate();
  const isActive = children == null ? value == lastMatchedLocationFullPath : value === currentTabValue;
  const handleTabChange = () => {
    setCurrentTabValue(value);
    if (children == null) {
      // tanstack router wants paths without trailing slashes
      // so we add a type game to ensure that
      void navigate({ to: removeLastSlash(value) });
    }
  };

  return (
    <button
      key={value}
      value={value}
      onClick={handleTabChange}
      className={cn('flex items-center gap-1 rounded-md border px-2 py-1 text-sm [&>svg]:size-4', {
        'bg-background': isActive,
        'border-transparent': !isActive,
      })}
      type="button"
      title={label}
    >
      {icon}
      <span
        className={cn('text-nowrap', {
          '@max-xl:hidden': !isActive,
        })}
      >
        {label}
      </span>
    </button>
  );
}
