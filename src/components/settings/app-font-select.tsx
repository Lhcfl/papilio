/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AVAILABLE_FONTS, fontAtom, setFontPreference } from '@/lib/font';
import { useAtomValue } from 'jotai';

export default function AppFontSelect() {
  const font = useAtomValue(fontAtom);

  return (
    <Select onValueChange={setFontPreference} value={font}>
      <SelectTrigger className="w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {AVAILABLE_FONTS.map(({ name, value }) => (
            <SelectItem key={value} value={value}>
              {name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
