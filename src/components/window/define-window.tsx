/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { SingleWindow } from '@/components/window/single-window';
import type { WindowDefinition, WindowMeta, WindowModel, WindowRootProps } from '@/components/window/types';

/**
 * Declares a window. The returned component takes the window's params as props,
 * plus the props of its root element.
 */
export function defineWindow<P = Record<string, never>>(
  meta: WindowMeta,
  useModel: (params: P) => WindowModel,
): WindowDefinition<P> {
  function WindowView(props: P & WindowRootProps) {
    return <SingleWindow model={useModel(props)} {...props} />;
  }

  return Object.assign(WindowView, meta);
}
