import { AppLanguageSelect } from '@/components/settings/app-language-select';
import { CogIcon } from 'lucide-react';

const t = (x: string) => x;

export const GeneralSettings = {
  value: 'general',
  name: t('general'),
  description: 'TODO',
  icon: <CogIcon />,
  categories: [
    {
      icon: <CogIcon />,
      name: t('general'),
      description: 'TODO',
      items: [
        {
          kind: 'custom',
          name: t('language'),
          direction: 'right' as 'right' | 'bottom',
          component: <AppLanguageSelect />,
        },
      ],
    },
  ],
} as const;
