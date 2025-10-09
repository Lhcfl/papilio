/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Languages Loader
 */

import * as fs from 'node:fs'
import * as yaml from 'js-yaml'

const PROJECT_ROOT = new URL('..', import.meta.url)

export const merge = (...args: any[]) =>
  args.reduce(
    (a, c) => ({
      ...a,
      ...c,
      ...Object.entries(a)
        .filter(([k]) => c && typeof c[k] === 'object')
        .reduce(
          (a, [k, v]) => ((a[k] = merge(v, c[k])), a),
          {} as Record<string, any>,
        ),
    }),
    {} as Record<string, any>,
  )

const languages = [
  'ar-SA',
  'ca-ES',
  'cs-CZ',
  'da-DK',
  'de-DE',
  'en-US',
  'es-ES',
  'fr-FR',
  'id-ID',
  'it-IT',
  'ja-JP',
  'ja-KS',
  'kab-KAB',
  'kn-IN',
  'ko-KR',
  'nl-NL',
  'no-NO',
  'pl-PL',
  'pt-PT',
  'ru-RU',
  'sk-SK',
  'th-TH',
  'ug-CN',
  'uk-UA',
  'vi-VN',
  'zh-CN',
  'zh-TW',
  'zh-WY',
]

const primaries: Record<string, string> = {
  en: 'US',
  ja: 'JP',
  zh: 'CN',
}

// 何故か文字列にバックスペース文字が混入することがあり、YAMLが壊れるので取り除く
//
// also, we remove the backslashes in front of open braces (the
// backslashes are only needed to tell `generateDTS.js` that the
// braces do not represent parameters)
const clean = (text: string) =>
  text
    .replace(new RegExp(String.fromCodePoint(0x08), 'g'), '')
    .replaceAll(new RegExp(/\\+\{/, 'g'), '{')

export const tryReadFile = (...rfsArgs: Parameters<typeof fs.readFileSync>) => {
  try {
    return fs.readFileSync(...rfsArgs).toString()
  }
  catch {
    console.warn(`[WARN] Missing ${rfsArgs[0]}, using empty string instead.`)
    return ''
  }
}

const locales_folders = [
  `locales`,
  `sharkey-locales`,
  `stpv-locales`,
  `sukerbuka-locales`,
]

function readLocale(locale: string) {
  return Object.fromEntries(
    languages.map(lang => [
      lang,
      yaml.load(
        clean(
          tryReadFile(
            new URL(`locales-source/${locale}/${lang}.yml`, PROJECT_ROOT),
            'utf-8',
          ),
        ),
      ) || {},
    ]),
  )
}

export function build() {
  // vitestの挙動を調整するため、一度ローカル変数化する必要がある
  // https://github.com/vitest-dev/vitest/issues/3988#issuecomment-1686599577
  // https://github.com/misskey-dev/misskey/pull/14057#issuecomment-2192833785
  // merge sharkey and misskey's locales. the second argument (sharkey) overwrites the first argument (misskey).
  const locales = merge(...locales_folders.map(l => readLocale(l)))

  // 空文字列が入ることがあり、フォールバックが動作しなくなるのでプロパティごと消す
  const removeEmpty = (obj: Record<string, any>) => {
    for (const [k, v] of Object.entries(obj)) {
      if (v === '') {
        delete obj[k]
      }
      else if (typeof v === 'object') {
        removeEmpty(v)
      }
    }
    return obj
  }

  removeEmpty(locales)

  const transformToI18nNext = (obj: Record<string, unknown>) => {
    for (const k of Object.keys(obj)) {
      if (typeof obj[k] === 'string') {
        obj[k] = obj[k].replaceAll(/{(\w+)}/g, (_, p1) => `{{${p1}}}`) // i18next形式に変換
      }
      if (typeof obj[k] === 'object') {
        transformToI18nNext(obj[k] as Record<string, unknown>)
      }
    }
  }

  transformToI18nNext(locales)

  return Object.entries(locales).reduce(
    (a, [k, v]) => (
      (a[k] = (() => {
        const [lang] = k.split('-')
        switch (k) {
          case 'ja-JP':
            return merge(locales['en-US'], v)
          case 'ja-KS':
            return merge(locales['en-US'], locales['ja-JP'], v)
          case 'en-US':
            return merge(locales['ja-JP'], v)
          default:
            return merge(
              locales['ja-JP'],
              locales['en-US'],
              locales[`${lang}-${primaries[lang]}`] ?? {},
              v,
            )
        }
      })()),
      a
    ),
    {} as Record<string, any>,
  )
}

const locales = build()

fs.mkdirSync('src/locales', { recursive: true })

for (const [key, val] of Object.entries(locales)) {
  console.log('building', key)
  fs.writeFileSync(
    `src/locales/${key}.json`,
    JSON.stringify(val, undefined, 2),
  )
}

fs.writeFileSync(
  `src/locales/index.json`,
  JSON.stringify(Object.keys(locales)),
)
