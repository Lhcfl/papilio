/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { createContext } from 'react';

export const NoteDefaultStateContext = createContext<{
  expandAllCw: boolean;
}>({
  expandAllCw: false,
});
