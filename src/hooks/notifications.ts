/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { misskeyApi } from '@/lib/inject-misskey-api';
import { useMutation } from '@tanstack/react-query';

export const useMarkAllAsReadAction = () =>
  useMutation({
    mutationKey: ['notifications/mark-all-as-read'],
    mutationFn: () => misskeyApi('notifications/mark-all-as-read', {}),
  });
