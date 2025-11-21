/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { IceShrimpFeatures, SharkeyFeatures, type ForkFeature } from '@/lib/features';
import { createContext, use, useMemo } from 'react';
export interface NodeInfo {
  version: string;
  software: {
    name: string;
    version: string;
    homepage: string;
  };
  protocols: string[];
  openRegistrations: boolean;
  usage: {
    users: {
      total: number;
      activeHalfyear: number;
      activeMonth: number;
    };
    localPosts: number;
    localComments: number;
  };
  metadata: {
    nodeName: string;
    nodeDescription: string;
    nodeAdmins: {
      name: string;
      email: string;
    }[];
    maintainer: {
      name: string;
      email: string;
    };
  };
}

export const NodeInfoContext = createContext<NodeInfo | null>(null);

export const useNodeInfo = <T>(selector: (arg: NodeInfo) => T) =>
  useMemo(() => {
    const meta = use(NodeInfoContext);
    if (!meta) throw new Error('node info is not set yet!');
    return selector(meta);
  }, [selector]);

export const useMisskeyForkFeatures = (): ForkFeature => {
  const name = use(NodeInfoContext)?.software.name ?? 'misskey';

  switch (name.toLowerCase()) {
    case 'misskey':
      return {};
    case 'iceshrimp':
    case 'firefish':
      return IceShrimpFeatures;
    case 'sharkey':
      return SharkeyFeatures;
    default:
      return {};
  }
};
