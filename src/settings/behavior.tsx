/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { BellIcon, CogIcon, FileUpIcon, WifiIcon } from 'lucide-react';

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
    {
      icon: <FileUpIcon />,
      name: t('file'),
      items: [
        {
          kind: 'switch',
          defaultValue: true,
          key: 'keepOriginalFilename',
          name: t('keepOriginalFilename'),
          description: t('keepOriginalFilenameDescription'),
        },
      ],
    },
    {
      icon: <BellIcon />,
      name: t('notifications'),
      items: [
        {
          kind: 'switch',
          defaultValue: true,
          key: 'clearNotificationsOnFocus',
          name: t('_preference.clearNotificationsOnFocus'),
          description: t('_preference.clearNotificationsOnFocusDesc'),
        },
      ],
    },
  ],
} as const;
