import { AppearanceSettings } from '@/settings/appearance';
import { GeneralSettings } from '@/settings/general';

export const DetailedSettings = [AppearanceSettings, GeneralSettings] as const;

function getAllSettings() {
  const DefaultSettings = {} as AllSettings;

  for (const settingPage of DetailedSettings) {
    for (const category of settingPage.categories) {
      for (const item of category.items) {
        if (item.kind === 'switch' || item.kind === 'enum') {
          (DefaultSettings as Record<string, unknown>)[item.key] = item.defaultValue;
        }
      }
    }
  }

  return DefaultSettings;
}

export const DefaultSettings = getAllSettings();

export type SettingsItems = (typeof DetailedSettings)[number]['categories'][number]['items'][number];
export type SwitchSettings = Extract<SettingsItems, { kind: 'switch' }>;
export type EnumSettings = Extract<SettingsItems, { kind: 'enum' }>;

export type AllSettings = Record<SwitchSettings['key'], boolean> & {
  [K in EnumSettings['key']]: Extract<EnumSettings, { key: K }>['values'][number];
};
