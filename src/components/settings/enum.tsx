import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { EnumSettings } from '@/settings';
import { setterName, usePreference } from '@/stores/perference';
import { useTranslation } from 'react-i18next';

export function EnumSettingItem({ item }: { item: EnumSettings }) {
  const value = usePreference((p) => p[item.key]);
  const setValue = usePreference((p) => p[setterName(item.key)]);
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-2">
      <div className="w-0 flex-[1_1]">
        <div className="text-base">{t(item.name)}</div>
        <div className="text-muted-foreground text-sm">{t(item.description)}</div>
      </div>
      <Select onValueChange={setValue as never} value={value}>
        <SelectTrigger className="w-30 sm:w-50 md:w-70">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {item.values.map((v, idx) => (
              <SelectItem key={v} value={v}>
                {'valuesI18n' in item ? t(item.valuesI18n[idx]) : t(item.name + 'Options.' + v)}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
