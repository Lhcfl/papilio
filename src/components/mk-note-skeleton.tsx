/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { Skeleton } from '@/components/ui/skeleton';

export const MkNoteSkeleton = () => {
  return (
    <div className="mk-note-skeleton p-2">
      <div className="note-header-skeleton flex items-center gap-2 p-2">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="flex-grow-1">
          <Skeleton className="ml-2 h-4 w-32" />
          <Skeleton className="mt-2 ml-2 h-4 w-20" />
        </div>
        <div>
          <Skeleton className="h-8 w-20" />
        </div>
      </div>
      <div className="note-body-skeleton p-2">
        <Skeleton className="mb-2 h-4 w-full" />
        <Skeleton className="mb-2 h-4 w-full" />
        <Skeleton className="mb-2 h-4 w-full" />
        <Skeleton className="mb-2 h-4 w-full" />
        <Skeleton className="h-4 w-[50%]" />
      </div>
      <div className="note-actions-skeleton flex p-2">
        <Skeleton className="mr-2 h-8 w-8 rounded-full" />
        <Skeleton className="mr-2 h-8 w-8 rounded-full" />
        <Skeleton className="mr-2 h-8 w-8 rounded-full" />
        <Skeleton className="mr-2 h-8 w-8 rounded-full" />
        <Skeleton className="mr-2 h-8 w-8 rounded-full" />
        <Skeleton className="mr-2 h-8 w-8 rounded-full" />
      </div>
    </div>
  );
};
