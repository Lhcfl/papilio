/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { CogIcon, WifiIcon } from 'lucide-react';

const t = (x: string) => x;

export const BehaviorSettings = {
  value: 'behavior',
  name: t('behavior'),
  description: t('_settings.preferencesBanner'),
  icon: <CogIcon />,
  categories: [
    {
      icon: <WifiIcon />,
      name: t('dataSaver'),
      items: [
        {
          kind: 'switch',
          defaultValue: false,
          name: t('_dataSaver._code.title'),
          description: t('_dataSaver._code.description'),
          key: 'dataSaverCode',
        },
      ],
    },
  ],
} as const;
