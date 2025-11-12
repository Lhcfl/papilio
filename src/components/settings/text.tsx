/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { SettingHeader } from '@/components/settings/header';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { ITextSettings } from '@/settings';
import { setterName, usePreference, useUserPreference } from '@/stores/perference';

export function TextSettingItem({ item, highlighted }: { item: ITextSettings; highlighted?: boolean }) {
  const isUser = item.user == true;

  const value = [
    usePreference((p) => p[item.key as never]) as string,
    useUserPreference((p) => p[item.key as never]) as string,
  ][isUser ? 1 : 0];

  const setValue = [
    usePreference((p) => p[setterName(item.key) as never]) as (v: string) => void,
    useUserPreference((p) => p[setterName(item.key) as never]) as (v: string) => void,
  ][isUser ? 1 : 0];

  const hidden = [
    usePreference((p) => (item.hidden ? item.hidden(p) : false)),
    useUserPreference((p) => (item.hidden ? item.hidden(p) : false)),
  ][isUser ? 1 : 0];

  if (hidden && !highlighted) {
    return null;
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <SettingHeader className={cn('w-full', { 'opacity-60': hidden })} item={item} hidden={hidden} />
      <Input
        className="w-full"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
      />
    </div>
  );
}
