/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { Skeleton } from '@/components/ui/skeleton';

export const MkUserCardSkeleton = () => (
  <div>
    <Skeleton className="h-48 w-full" />
    <div className="flex justify-between p-2">
      <div className="bg-background z-10 -mt-14 ml-2 rounded-lg p-2">
        <Skeleton className="size-18 rounded-lg" />
      </div>
      <Skeleton className="h-7 w-14" />
    </div>
    <div className="px-2 pb-2">
      <Skeleton className="mb-2 h-2 w-full" />
      <Skeleton className="mb-2 h-2 w-full" />
      <Skeleton className="h-2 w-[50%]" />
    </div>
    <div className="px-2 pb-2">
      <Skeleton className="mb-2 h-2 w-24" />
      <Skeleton className="mb-2 h-2 w-17" />
      <Skeleton className="mb-2 h-2 w-36" />
    </div>
  </div>
);
