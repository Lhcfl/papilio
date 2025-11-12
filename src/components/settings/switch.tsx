/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { SettingHeader } from '@/components/settings/header';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import type { SwitchSettings } from '@/settings';
import { setterName, usePreference } from '@/stores/perference';

export function SwitchSettingItem({ item, highlighted }: { item: SwitchSettings; highlighted?: boolean }) {
  const value = usePreference((p) => p[item.key]);
  const setValue = usePreference((p) => p[setterName(item.key)]);
  const hiddenCondition = 'hidden' in item ? item.hidden : null;
  const hidden = usePreference((p) => hiddenCondition?.(p) ?? false);

  if (hidden && !highlighted) {
    return null;
  }

  return (
    <div className="w-full">
      <Label className="w-full">
        <SettingHeader className={cn('w-0 flex-[1_1]', { 'opacity-60': hidden })} item={item} hidden={hidden} />
        <Switch name={item.key} checked={value} onCheckedChange={setValue} disabled={hidden} />
      </Label>
    </div>
  );
}
