/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { Window, WindowActions, WindowBody, WindowHeader, WindowTitle } from '@/components/window/window';
import type { WindowModel } from '@/components/window/types';
import { cn } from '@/lib/utils';
import type { ComponentProps } from 'react';

/**
 * A window with a single view: its title sits at the start of the header,
 * actions at the end, and the body fills the rest.
 */
export function SingleWindow({
  model,
  className,
  ...props
}: { model: WindowModel } & ComponentProps<'div'>) {
  return (
    <Window className={cn('bg-sidebar h-0 flex-[1_1] overflow-hidden rounded-lg', className)} {...props}>
      <WindowHeader className="border-b p-1">
        <WindowTitle className="ml-2">
          {model.icon}
          {model.title}
        </WindowTitle>
        {model.actions != null && <WindowActions>{model.actions}</WindowActions>}
      </WindowHeader>
      <WindowBody>{model.body}</WindowBody>
    </Window>
  );
}
