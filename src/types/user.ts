/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type {
  UserDetailed as MisskeyUserDetailed,
  User as MisskeyUser,
  UserLite as MisskeyUserLite,
} from 'misskey-js/entities.js';
import type {
  UserDetailed as SharkeyUserDetailed,
  User as SharkeyUser,
  UserLite as SharkeyUserLite,
} from '@@/sharkey-js/entities.js';

export type UserDetailed = MisskeyUserDetailed & Partial<Omit<SharkeyUserDetailed, keyof MisskeyUserDetailed>>;
export type User = MisskeyUser & Partial<Omit<SharkeyUser, keyof MisskeyUser>>;
export type UserLite = MisskeyUserLite & Partial<Omit<SharkeyUserLite, keyof MisskeyUserLite>>;
