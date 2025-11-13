/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { SharkeyFeatures, type ForkFeature } from '@/lib/features';
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
    if (!meta) throw new Error('site meta is not set yet!');
    return selector(meta);
  }, [selector]);

export const useMisskeyForkFeatures = (): ForkFeature => {
  const name = useNodeInfo((meta) => meta.software.name);

  switch (name.toLowerCase()) {
    case 'misskey':
      return {};
    case 'firefish':
      return SharkeyFeatures;
    case 'sharkey':
      return SharkeyFeatures;
    default:
      return {};
  }
};
