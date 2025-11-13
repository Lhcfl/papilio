/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { StartDownloaderTui } from './tui/downloader';

StartDownloaderTui(
  {
    'packages/misskey-js/src': 'sharkey-js',
  },
  {
    prepend: '// @ts-nocheck\n//This file is auto downloaded by update-sharkey-js.ts\n\n',
  },
);
