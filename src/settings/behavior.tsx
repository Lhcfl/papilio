/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { defineCategory, defineCustom, defineSwitch } from '@/settings/types';
import { BellIcon, CogIcon, FileUpIcon, WifiIcon } from 'lucide-react';
import { lazy } from 'react';

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
        defineSwitch('dataSaverCode', {
          defaultValue: false,
          name: t('_dataSaver._code.title'),
          description: t('_dataSaver._code.description'),
        }),
      ],
    },
    defineCategory({
      icon: <CogIcon />,
      name: t('general'),
      description: 'TODO',
      items: [
        defineSwitch('disableAvatarHover', {
          defaultValue: false,
          name: t('_preference.disableAvatarHover'),
          description: t('_preference.disableAvatarHoverDesc'),
          // disable this setting on touch devices
          hidden: () => navigator.maxTouchPoints > 0,
        }),
      ],
    }),
    {
      icon: <FileUpIcon />,
      name: t('file'),
      items: [
        defineCustom(
          lazy(() => import('@/components/settings/mk-drive-usage')),
          {
            name: t('driveUsage'),
            direction: 'right',
          },
        ),
        defineSwitch('keepOriginalFilename', {
          defaultValue: true,
          name: t('keepOriginalFilename'),
          description: t('keepOriginalFilenameDescription'),
        }),
      ],
    },
    {
      icon: <BellIcon />,
      name: t('notifications'),
      items: [
        defineSwitch('clearNotificationsOnFocus', {
          defaultValue: true,
          name: t('_preference.clearNotificationsOnFocus'),
          description: t('_preference.clearNotificationsOnFocusDesc'),
        }),
      ],
    },
  ],
} as const;
