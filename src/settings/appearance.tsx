/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { createCategory, createCustomSetting, createEnum, createSettingsPage, createSwitch } from '@/settings/types';
import { CogIcon, PaletteIcon } from 'lucide-react';
import { lazy } from 'react';

const t = (x: string) => x;

export const AppearanceSettings = createSettingsPage({
  value: 'appearance',
  name: t('appearance'),
  description: t('_settings.appearanceBanner'),
  icon: <PaletteIcon />,
  categories: [
    createCategory({
      icon: <PaletteIcon />,
      name: t('theme'),
      description: 'TODO',
      items: [
        createEnum('theme', {
          defaultValue: 'light',
          values: ['light', 'dark'] as const,
          valuesI18n: ['light', 'dark'],
          name: t('theme'),
          description: t('myTheme'),
        }),
        createCustomSetting(
          lazy(() => import('@/components/settings/app-font-select')),
          {
            name: t('_stpvPlus.defaultFont.label'),
            direction: 'right' as 'right' | 'bottom',
          },
        ),
      ],
    }),
    createCategory({
      icon: <CogIcon />,
      name: t('general'),
      description: 'TODO',
      items: [
        createCustomSetting(
          lazy(() => import('@/components/settings/app-language-select')),
          {
            name: t('language'),
            direction: 'right',
          },
        ),
        createSwitch('showAvatarDecorations', {
          defaultValue: true,
          name: t('showAvatarDecorations'),
        }),
        createEnum('cssTextAutospace', {
          defaultValue: 'normal',
          values: ['no-autospace', 'normal'] as const,
          name: t('_preference.cssTextAutospace'),
          description: t('_preference.cssTextAutospaceDesc'),
          experimental: t('browserExperimental'),
        }),
        createSwitch('groupNotifications', {
          defaultValue: true,
          name: t('useGroupedNotifications'),
        }),
      ],
    }),
  ],
});
