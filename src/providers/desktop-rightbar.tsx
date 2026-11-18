/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { AppRightCard } from '@/components/app-right-card';
import { ScrollArea } from '@/ui/scroll-area';

export const DesktopRightbar = () => {
  return (
    <div className="app-right-card-container bg-sidebar relative border-l max-lg:hidden">
      <ScrollArea className="@container/right h-screen w-80 p-2 2xl:w-[21rem]">
        <AppRightCard className="h-[calc(100vh-var(--spacing)*4)]" />
      </ScrollArea>
    </div>
  );
};
