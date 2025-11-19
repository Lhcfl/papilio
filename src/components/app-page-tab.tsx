/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { HeaderCenterPortal } from '@/components/header-portal';
import { cn } from '@/lib/utils';
import { PageTabContext } from '@/providers/page-tab-provider';
import { useLocation, useNavigate } from '@tanstack/react-router';
import { useAtom } from 'jotai';
import { use } from 'react';

export function AppPageTabList({ children }: { children: React.ReactNode[] }) {
  return (
    <HeaderCenterPortal>
      {children.length > 0 && <div className="bg-muted flex items-center rounded-lg p-1">{children}</div>}
    </HeaderCenterPortal>
  );
}

export function AppPageTab({
  value,
  label,
  icon,
  children,
}: {
  value: string;
  label: string;
  icon: React.ReactNode;
  children?: React.ReactNode;
}) {
  const [currentTabValue, setCurrentTabValue] = useAtom(use(PageTabContext));
  const loc = useLocation();
  const removedTailingSlashPathname = loc.pathname.replace(/\/+$/, '') || '/';
  const navigate = useNavigate();
  const isActive = children == null ? value == removedTailingSlashPathname : value === currentTabValue;

  const handleTabChange = (value: string) => {
    setCurrentTabValue(value);
    if (children == null) {
      void navigate({ to: value });
    }
  };

  return (
    <button
      key={value}
      value={value}
      onClick={() => {
        handleTabChange(value);
      }}
      className={cn('flex items-center gap-1 rounded-md border px-2 py-1 text-sm [&>svg]:size-4', {
        'bg-background': isActive,
        'border-transparent': !isActive,
      })}
      type="button"
      title={label}
    >
      {icon}
      <span
        className={cn({
          '@max-xl:hidden': !isActive,
        })}
      >
        {label}
      </span>
    </button>
  );
}
