import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import type { SwitchSettings } from '@/settings';
import { setterName, usePerference } from '@/stores/perference';
import { useTranslation } from 'react-i18next';

export function SwitchSettingItem({ item }: { item: SwitchSettings }) {
  const value = usePerference((p) => p[item.key]);
  const setValue = usePerference((p) => p[setterName(item.key)]);
  const { t } = useTranslation();

  return (
    <div>
      <Label>
        <Switch name={item.key} checked={value} onChange={setValue as never} />
        <div className="ml-2">
          <div>{t(item.name)}</div>
          <div>{t(item.description)}</div>
        </div>
      </Label>
    </div>
  );
}
