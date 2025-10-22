/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { StartDownloaderTui } from './tui/downloader';

StartDownloaderTui({
  'misskey-dev/misskey/develop:locales': 'locales-source/locales',
  'sharkey-locales': 'locales-source/sharkey-locales',
  'stpv-locales': 'locales-source/stpv-locales',
});
