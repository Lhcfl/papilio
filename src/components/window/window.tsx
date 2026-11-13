/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { cn } from '@/lib/utils';
import { ScrollArea } from '@/ui/scroll-area';
import type { ComponentProps } from 'react';

/** The window shell: a fixed header above a scrollable body. */
export function Window({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('flex min-h-0 flex-col', className)} {...props} />;
}

/** Header row of a window. */
export function WindowHeader({ className, ...props }: ComponentProps<'header'>) {
  return <header className={cn('flex shrink-0 items-center justify-between gap-1', className)} {...props} />;
}

/** Scrollable content area of a window. */
export function WindowBody({ className, ...props }: ComponentProps<typeof ScrollArea>) {
  return <ScrollArea className={cn('min-h-0 flex-1', className)} {...props} />;
}

/** Title area of a window header. */
export function WindowTitle({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('title flex min-w-0 items-center gap-1 text-sm', className)} {...props} />;
}

/** Action area of a window header. */
export function WindowActions({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('flex items-center gap-1', className)} {...props} />;
}
