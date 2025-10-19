/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { Skeleton } from '@/components/ui/skeleton';

export const MkUserCardSkeleton = () => (
  <div>
    <Skeleton className="w-full h-48" />
    <div className="flex p-2 justify-between">
      <div className="ml-2 p-2 bg-background -mt-14 z-10 rounded-lg">
        <Skeleton className="size-18 rounded-lg" />
      </div>
      <Skeleton className="w-14 h-7" />
    </div>
    <div className="px-2 pb-2">
      <Skeleton className="w-full h-2 mb-2" />
      <Skeleton className="w-full h-2 mb-2" />
      <Skeleton className="w-[50%] h-2" />
    </div>
    <div className="px-2 pb-2">
      <Skeleton className="w-24 h-2 mb-2" />
      <Skeleton className="w-17 h-2 mb-2" />
      <Skeleton className="w-36 h-2 mb-2" />
    </div>
  </div>
);
