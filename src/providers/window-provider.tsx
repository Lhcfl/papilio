/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { createContext } from 'react';

export const WindowContext = createContext<{
  headerId: string;
}>({
  headerId: 'ptrb-header',
});

export function getHeaderLeftId(id: string) {
  return `${id}__left`;
}

export function getHeaderRightId(id: string) {
  return `${id}__right`;
}

export function getHeaderCenterId(id: string) {
  return `${id}__center`;
}
