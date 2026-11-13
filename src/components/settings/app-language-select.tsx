/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/ui/select';
import langs from '@/assets/langs.json';
import { useTranslation } from 'react-i18next';

export default function AppLanguageSelect() {
  const { i18n } = useTranslation();

  function changeLanguage(lng: string) {
    void i18n.changeLanguage(lng);
    localStorage.setItem('lang', lng);
    document.documentElement.lang = lng;
  }

  return (
    <Select
      onValueChange={(value) => {
        if (value != null) changeLanguage(value);
      }}
      value={i18n.language}
    >
      <SelectTrigger className="w-40 @md:w-52">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {Object.entries(langs).map(([key, value]) => (
            <SelectItem key={key} value={key}>
              {value}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
