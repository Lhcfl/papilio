import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { EnumSettings } from '@/settings';
import { setterName, usePerference } from '@/stores/perference';
import { useTranslation } from 'react-i18next';

export function EnumSettingItem({ item }: { item: EnumSettings }) {
  const value = usePerference((p) => p[item.key]);
  const setValue = usePerference((p) => p[setterName(item.key)]);
  const { t } = useTranslation();

  return (
    <div>
      <div>{t(item.name)}</div>
      <div>{t(item.description)}</div>
      <Select onValueChange={setValue as never} value={value}>
        <SelectTrigger className="w-100">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {item.values.map((v) => (
              <SelectItem key={v} value={v}>
                {v}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
