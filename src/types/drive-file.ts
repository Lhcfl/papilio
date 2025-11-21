/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { NoteWithExtension } from '@/types/note';

export type DriveFile = NonNullable<NoteWithExtension['files']>[number];
