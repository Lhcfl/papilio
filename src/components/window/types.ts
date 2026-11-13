/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { ComponentProps, ReactNode } from 'react';

export interface WindowModel {
  icon?: ReactNode;
  title: ReactNode;
  /** Plain text used for `document.title`; only consumed by the primary window. */
  caption?: string;
  actions?: ReactNode;
  body: ReactNode;
}

export interface WindowMeta {
  id: string;
  version: number;
  /** Canonical URL of the window; only windows with a route can become the primary one. */
  route?: string;
}

export type WindowRootProps = Omit<ComponentProps<'div'>, 'children'>;

export type WindowDefinition<P> = ((props: P & WindowRootProps) => ReactNode) & WindowMeta;
