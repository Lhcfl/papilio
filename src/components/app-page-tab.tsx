/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { HeaderCenterPortal } from '@/components/header-portal';
import { cn } from '@/lib/utils';
import { PageTabContext } from '@/providers/page-tab-provider';
import type { Tab } from '@/types/page-header';
import { useLocation, useNavigate } from '@tanstack/react-router';
import { useAtom } from 'jotai';
import { use } from 'react';

export function AppPageTabs({ tabs, routerTab = true }: { tabs: Tab[]; routerTab?: boolean }) {
  const filteredTabs = tabs.filter((x) => x) as Exclude<Tab, null | false>[];
  const [currentTabValue, setCurrentTabValue] = useAtom(use(PageTabContext));
  const loc = useLocation();
  const removedTailingSlashPathname = loc.pathname.replace(/\/+$/, '') || '/';
  const actualCurrentTab = filteredTabs.find(
    (tab) => tab.value === (routerTab ? removedTailingSlashPathname : currentTabValue),
  );
  const navigate = useNavigate();

  const handleTabChange = (value: string) => {
    setCurrentTabValue(value);
    if (routerTab) {
      void navigate({ to: value });
    }
  };

  return (
    <HeaderCenterPortal>
      {filteredTabs.length > 0 && (
        <div className="bg-muted flex items-center rounded-lg p-1">
          {filteredTabs.map((tab) => (
            <button
              key={tab.value}
              value={tab.value}
              onClick={() => {
                handleTabChange(tab.value);
              }}
              className={cn('flex items-center gap-1 rounded-md border px-2 py-1 text-sm [&>svg]:size-4', {
                'bg-background': tab.value === actualCurrentTab?.value,
                'border-transparent': tab.value !== actualCurrentTab?.value,
              })}
              type="button"
              title={tab.label}
            >
              {tab.icon}
              <span
                className={cn({
                  '@max-xl:hidden': tab.value != actualCurrentTab?.value,
                })}
              >
                {tab.label}
              </span>
            </button>
          ))}
        </div>
      )}
    </HeaderCenterPortal>
  );
}
