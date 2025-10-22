import type { CogIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface SettingPage {
  key: string;
  icon: React.ReactNode;
  name: string;
  description?: string;
  categories: SettingCategory[];
}

interface SettingCategory {
  key: string;
  icon: React.ReactNode;
  name: string;
  description?: string;
  items: SettingItem[];
}

type SettingItem = {
  key: string;
  name: string;
  description?: string;
} & (
  | {
      kind: 'switch';
      valueKey: Prefer;
    }
  | {
      kind: 'custom';
      component: React.ReactNode;
    }
);

export function useSettings(): SettingPage {
  const t = useTranslation();

  return [
    {
      key: 'general',
      icon: <CogIcon />,
      name: t('settings'),
      categories: [
        {
          key: 'appearance',
          icon: '🎨',
          name: t('appearanceSettings'),
          items: [
            {
              key: 'theme',
              name: t('themeSettings'),
              component: <div>Theme Settings Component</div>,
            },
          ],
        },
      ],
    },
  ];
}
