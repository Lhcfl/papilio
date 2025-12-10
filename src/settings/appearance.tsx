/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { defineCategory, defineCustom, defineEnum, defineSettingsPage, defineSwitch } from '@/settings/types';
import { CogIcon, PaletteIcon } from 'lucide-react';
import { lazy } from 'react';

const t = (x: string) => x;

export const AppearanceSettings = defineSettingsPage({
  value: 'appearance',
  name: t('appearance'),
  description: t('_settings.appearanceBanner'),
  icon: <PaletteIcon />,
  categories: [
    defineCategory({
      icon: <PaletteIcon />,
      name: t('theme'),
      description: 'TODO',
      items: [
        defineEnum('theme', {
          defaultValue: 'light',
          values: ['light', 'dark'] as const,
          valuesI18n: ['light', 'dark'],
          name: t('theme'),
          description: t('myTheme'),
        }),
        defineCustom(
          lazy(() => import('@/components/settings/app-font-select')),
          {
            name: t('_stpvPlus.defaultFont.label'),
            direction: 'right' as 'right' | 'bottom',
          },
        ),
        defineEnum('emojiStyle', {
          defaultValue: 'twemoji',
          values: ['native', 'twemoji', 'fluent-emoji', 'tossface'] as const,
          name: t('emojiStyle'),
          valuesI18n: [t('native'), 'Twemoji', 'Fluent Emoji', 'Tossface'],
        }),
      ],
    }),
    defineCategory({
      icon: <CogIcon />,
      name: t('general'),
      description: 'TODO',
      items: [
        defineCustom(
          lazy(() => import('@/components/settings/app-language-select')),
          {
            name: t('language'),
            direction: 'right',
          },
        ),
        defineSwitch('showAvatarDecorations', {
          defaultValue: true,
          name: t('showAvatarDecorations'),
        }),
        defineEnum('cssTextAutospace', {
          defaultValue: 'normal',
          values: ['no-autospace', 'normal'] as const,
          name: t('_preference.cssTextAutospace'),
          description: t('_preference.cssTextAutospaceDesc'),
          experimental: t('browserExperimental'),
        }),
        defineSwitch('groupNotifications', {
          defaultValue: true,
          name: t('useGroupedNotifications'),
        }),
        defineSwitch('smartTimeline', {
          defaultValue: false,
          name: t('_preference.smartTimeline'),
          description: t('_preference.smartTimelineDesc'),
        }),
      ],
    }),
  ],
});
