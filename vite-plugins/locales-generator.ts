/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Plugin } from 'vite';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import * as yaml from 'js-yaml';
import path from 'node:path';

const PROJECT_ROOT = new URL('..', import.meta.url);

function merge(...args: Record<string, unknown>[]): Record<string, unknown> {
  const keys = Array.from(new Set(args.map((x) => Object.keys(x)).flat()));

  return Object.fromEntries(
    keys.map((key) => [
      key,
      (() => {
        const values = args.map((x) => x[key]);
        const objects = values.filter((v) => typeof v === 'object' && v !== null) as Record<string, unknown>[];

        if (objects.length > 0) {
          return merge(...objects);
        }

        return values.findLast((x) => x != null && x != '');
      })(),
    ]),
  );
}

const transformToI18nNext = (obj: Record<string, unknown>) => {
  for (const k of Object.keys(obj)) {
    if (typeof obj[k] === 'string') {
      obj[k] = obj[k].replaceAll(/{(\w+)}/g, (_, p1) => `{{${p1}}}`); // change to i18next style interpolation
    }
    if (typeof obj[k] === 'object') {
      transformToI18nNext(obj[k] as Record<string, unknown>);
    }
  }
};

// For some reason, backspace characters sometimes get mixed into strings and corrupt YAML, so we remove them
const clean = (text: string) => text.replace(new RegExp(String.fromCodePoint(0x08), 'g'), '');

const primaries: Record<string, string> = {
  en: 'US',
  ja: 'JP',
  zh: 'CN',
};

export const PapilioI18nGenerator = (): Plugin => {
  let locales_cache: Record<string, Record<string, unknown>> = {};

  const locales_folders = [`locales`, `sharkey-locales`, `stpv-locales`, `sukerbuka-locales`];

  const languages = [
    ...new Set(
      locales_folders
        .flatMap((x) => fs.readdirSync(new URL(`locales-source/${x}`, PROJECT_ROOT)))
        .filter((f) => f.endsWith('.yml'))
        .map((f) => f.replace(/\.yml$/, '')),
    ),
  ];

  const readLocale = (locale: string) =>
    Promise.all(
      languages.map((lang) =>
        fsp
          .readFile(new URL(`locales-source/${locale}/${lang}.yml`, PROJECT_ROOT), 'utf-8')
          .catch(() => '')
          .then((data) => {
            const content = clean(data);
            return [lang, (yaml.load(content) ?? {}) as Record<string, unknown>] as const;
          }),
      ),
    ).then((entries) => Object.fromEntries(entries));

  async function build() {
    const locales = merge(...(await Promise.all(locales_folders.map((l) => readLocale(l))))) as Record<
      string,
      Record<string, unknown>
    >;

    transformToI18nNext(locales);

    return Object.fromEntries(
      Object.entries(locales).map(([code, v]) => [
        code,
        (() => {
          const [lang] = code.split('-');
          switch (code) {
            case 'ja-JP':
              return merge(locales['en-US'], v);
            case 'ja-KS':
              return merge(locales['en-US'], locales['ja-JP'], v);
            case 'en-US':
              return merge(locales['ja-JP'], v);
            default:
              return merge(locales['ja-JP'], locales['en-US'], locales[`${lang}-${primaries[lang]}`] ?? {}, v);
          }
        })(),
      ]),
    );
  }

  return {
    name: 'papilio-i18n-locales-generator',

    async buildStart() {
      locales_cache = await build();

      await fsp.writeFile(
        `src/assets/langs.json`,
        JSON.stringify(Object.fromEntries(Object.entries(locales_cache).map(([k, v]) => [k, v._lang_])), undefined, 2),
      );
    },

    generateBundle() {
      for (const [code, json] of Object.entries(locales_cache)) {
        // 输出到 dist/locales/*.json
        this.emitFile({
          type: 'asset',
          fileName: `locales/${code}.json`,
          source: JSON.stringify(json),
        });
      }
    },

    configureServer(server) {
      server.watcher.add('locales-source/**');

      server.watcher.on('change', (filePath) => {
        if (!filePath.includes('locales-source')) {
          return;
        }

        const langCode = path.basename(filePath, '.yml');
        locales_cache[langCode] = merge(
          locales_cache[langCode],
          yaml.load(clean(fs.readFileSync(filePath, 'utf-8'))) as Record<string, unknown>,
        );

        // 通知浏览器执行 HMR
        server.ws.send({
          type: 'full-reload',
          path: '/locales/',
        });

        this.info(`[i18n-generator]: ${langCode} changed, rebuilding locales...`);
      });

      server.middlewares.use((req, res, next) => {
        if (!req.url?.startsWith('/locales/')) {
          next();
          return;
        }
        const langCode = req.url.replace('/locales/', '').replace('.json', '');
        if (langCode in locales_cache) {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(locales_cache[langCode]));
          return;
        } else {
          res.statusCode = 404;
          res.end('Not Found');
          return;
        }
      });
    },
  };
};
