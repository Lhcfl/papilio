/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { Spinner } from '@/components/ui/spinner';
import { toHumanReadableFileSize } from '@/lib/file';
import { misskeyApi } from '@/lib/inject-misskey-api';
import { useQuery } from '@tanstack/react-query';

export default function MkDriveUsage() {
  const { data, isLoading } = useQuery({
    queryKey: ['drive-usage'],
    queryFn: () => misskeyApi('drive', {}),
  });

  if (isLoading) {
    return <Spinner />;
  }

  if (data == null) {
    return <div>Error loading.</div>;
  }

  const { usage, capacity } = data;

  return (
    <div>
      {toHumanReadableFileSize(usage)} / {toHumanReadableFileSize(capacity)} ({Math.round((usage / capacity) * 100)}%)
    </div>
  );
}
