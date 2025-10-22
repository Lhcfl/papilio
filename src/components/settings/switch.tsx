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
    <div className="w-full">
      <Label className="w-full">
        <div className="w-0 flex-[1_1]">
          <div className="text-base">{t(item.name)}</div>
          {'description' in item && item.description && (
            <div className="text-muted-foreground text-sm">{t(item.description)}</div>
          )}
        </div>
        <Switch name={item.key} checked={value} onCheckedChange={setValue} />
      </Label>
    </div>
  );
}
