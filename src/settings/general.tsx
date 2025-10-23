import { AppLanguageSelect } from '@/components/settings/app-language-select';
import { CogIcon, WifiIcon } from 'lucide-react';

const t = (x: string) => x;

export const GeneralSettings = {
  value: 'general',
  name: t('general'),
  description: t('_settings.preferencesBanner'),
  icon: <CogIcon />,
  categories: [
    {
      icon: <CogIcon />,
      name: t('general'),
      description: t('_settings.preferencesBanner'),
      items: [
        {
          kind: 'custom',
          name: t('language'),
          direction: 'right' as 'right' | 'bottom',
          component: <AppLanguageSelect />,
        },
      ],
    },
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
