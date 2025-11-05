/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { CogIcon, PaletteIcon } from 'lucide-react';

const t = (x: string) => x;

export const AppearanceSettings = {
  value: 'appearance',
  name: t('appearance'),
  description: t('_settings.appearanceBanner'),
  icon: <PaletteIcon />,
  categories: [
    {
      icon: <PaletteIcon />,
      name: t('theme'),
      description: 'TODO',
      items: [
        {
          kind: 'enum',
          key: 'theme',
          defaultValue: 'light',
          values: ['light', 'dark'],
          valuesI18n: ['light', 'dark'],
          name: t('theme'),
          description: t('myTheme'),
        },
      ],
    },
    {
      icon: <CogIcon />,
      name: t('general'),
      description: 'TODO',
      items: [
        {
          kind: 'switch',
          defaultValue: true,
          name: t('showAvatarDecorations'),
          key: 'showAvatarDecorations',
        },
        {
          kind: 'enum',
          key: 'cssTextAutospace',
          defaultValue: 'normal',
          values: ['no-autospace', 'normal'],
          name: t('_preference.cssTextAutospace'),
          description: t('_preference.cssTextAutospaceDesc'),
          experimental: t('browserExperimental'),
        },
      ],
    },
  ],
} as const;
