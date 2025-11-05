/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import type { EnumSettings } from '@/settings';
import { setterName, usePreference } from '@/stores/perference';
import { FlaskConicalIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function EnumSettingItem({ item }: { item: EnumSettings }) {
  const value = usePreference((p) => p[item.key]);
  const setValue = usePreference((p) => p[setterName(item.key)]);
  const { t } = useTranslation();

  function getValueDisplayName(val: string, index: number) {
    if ('valuesI18n' in item) {
      if (Array.isArray(item.valuesI18n[index])) {
        return t(...(item.valuesI18n[index] as never));
      }
      return t(item.valuesI18n[index] as never);
    } else {
      return t(item.name + 'Options.' + val);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <div className="w-0 flex-[1_1]">
        <div className="inline-flex items-center gap-1 text-base">
          {t(item.name)}
          {'experimental' in item && item.experimental && (
            <Tooltip>
              <TooltipTrigger title="experimental" type="button">
                <FlaskConicalIcon className="size-4 text-blue-500" />
              </TooltipTrigger>
              <TooltipContent>{t(item.experimental)}</TooltipContent>
            </Tooltip>
          )}
        </div>
        {'description' in item && item.description && (
          <div className="text-muted-foreground text-sm">{t(item.description)}</div>
        )}
      </div>
      <Select onValueChange={setValue as never} value={value}>
        <SelectTrigger className="w-30 sm:w-50 md:w-70">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {item.values.map((v, idx) => (
              <SelectItem key={v} value={v}>
                {getValueDisplayName(v, idx)}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
