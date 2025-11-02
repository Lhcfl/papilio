/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import '@tanstack/react-router';

declare module '@tanstack/react-router' {
  interface StaticDataRouteOption {
    noAuth?: boolean;
  }
}

declare global {
  declare const __APP_VERSION__: string;
  declare const __APP_REPO__: string;
  declare const __APP_BUILD_DATE__: string;
  declare const __APP_COMMIT_HASH__: string;
}
