/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import languages from '@/assets/langs.json';
import HttpBackend, { type HttpBackendOptions } from 'i18next-http-backend';

function getLanguage() {
  const lang = localStorage.getItem('lang');
  if (lang && lang in languages) return lang;
  if (navigator.language in languages) return navigator.language;
  return 'en-US';
}

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
void i18n
  .use(HttpBackend)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init<HttpBackendOptions>({
    supportedLngs: Object.keys(languages),
    backend: {
      loadPath: `/locales/{{lng}}.json`,
      // queryStringParams: { v: "" },
    },
    lng: getLanguage(), // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
