/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

// This file is fucking magical.
// It automatically generates the DefaultSettings and DefaultUserSettings based on their typescript definitions.
// Change the file ONLY when you have a good skill of typescript. :P

import { AppearanceSettings } from '@/settings/appearance';
import { BehaviorSettings } from '@/settings/behavior';
import { NoteSettings } from '@/settings/note';
import { PostFormSettings } from '@/settings/postform';

export const DetailedSettings = [BehaviorSettings, AppearanceSettings, NoteSettings, PostFormSettings] as const;

function getAllSettings() {
  const DefaultSettings = {} as AllSettings;

  for (const settingPage of DetailedSettings) {
    for (const category of settingPage.categories) {
      for (const item of category.items) {
        if ('key' in item && 'defaultValue' in item && !item.user) {
          (DefaultSettings as Record<string, unknown>)[item.key] = item.defaultValue;
        }
      }
    }
  }

  return DefaultSettings;
}

export const DefaultSettings = getAllSettings();

export const DefaultUserSettings = (() => {
  const DefaultSettings = {} as AllUserSettings;

  for (const settingPage of DetailedSettings) {
    for (const category of settingPage.categories) {
      for (const item of category.items) {
        if ('key' in item && 'defaultValue' in item && item.user) {
          (DefaultSettings as Record<string, unknown>)[item.key] = item.defaultValue;
        }
      }
    }
  }

  return DefaultSettings;
})();

export type SettingsItems = (typeof DetailedSettings)[number]['categories'][number]['items'][number];
export type SwitchSettings = Extract<SettingsItems, { kind: 'switch' }>;
export type EnumSettings = Extract<SettingsItems, { kind: 'enum' }>;
export type CustomSettings = Extract<SettingsItems, { kind: 'custom'; defaultValue: string; user?: false }>;

export type AllSettings = Record<SwitchSettings['key'], boolean> & {
  [K in EnumSettings['key']]: Extract<EnumSettings, { key: K }>['values'][number];
} & {
  [K in CustomSettings['key']]: Extract<CustomSettings, { key: K }>['defaultValue'];
};

type CustomUserSettings = Extract<SettingsItems, { kind: 'custom'; defaultValue: string; user?: true }>;
type TextUserSettings = Extract<SettingsItems, { kind: 'text'; user?: true }>;

export interface ITextSettings {
  readonly kind: 'text';
  readonly key: string;
  readonly defaultValue: string;
  readonly name: string;
  readonly description?: string;
  readonly user?: true;
  readonly hidden?: (settings: AllUserSettings | AllSettings) => boolean;
}

export type AllUserSettings = {
  [K in NonNullable<CustomUserSettings['key']>]?: Extract<CustomUserSettings, { key?: K }>['defaultValue'];
} & {
  [K in TextUserSettings['key']]?: Extract<TextUserSettings, { key: K }>['defaultValue'];
};
