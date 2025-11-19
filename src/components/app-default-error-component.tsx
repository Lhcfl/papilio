/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { MkError } from '@/components/mk-error';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import { useEffect } from 'react';

export function AppDefaultErrorComponent({ error }: { error: Error }) {
  const router = useRouter();
  const boundary = useQueryErrorResetBoundary();

  useEffect(() => {
    boundary.reset();
  }, [boundary]);

  return <MkError error={error} retry={() => router.invalidate()} />;
}
