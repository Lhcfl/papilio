/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { useMedia } from 'react-use';

export function useIsMobile() {
  return useMedia(`(max-width: 48rem)`, false);
}
