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
import type { Merge } from '@/types/utils';

export type UserDetailed = Merge<MisskeyUserDetailed, SharkeyUserDetailed>;
export type User = Merge<MisskeyUser, SharkeyUser>;
export type UserLite = Merge<MisskeyUserLite, SharkeyUserLite>;
