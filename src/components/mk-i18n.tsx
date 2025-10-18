/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Fragment } from 'react/jsx-runtime';

interface ParsedToken {
  type: 'string' | 'slot';
  value: string;
  key: string;
}

/**
 * 解析包含 {{ slot }} 语法的字符串
 *
 * ## 样例
 *
 * ```
 * there {{ plural }} {{ n }} users, {{ n }} is count.
 * ```
 *
 * 将会解析成
 *
 * ```
 * [
 *   { type: "string", value: "there " },
 *   { type: "slot", value: "plural" },
 *   { type: "string", value: " " },
 *   { type: "slot", value: "n" },
 *   { type: "string", value: " users, " },
 *   { type: "slot", value: "n" },
 *   { type: "string", value: " is count." }
 * ]
 * ```
 * @param input 要解析的字符串
 * @returns 解析后的 token 列表
 */
function parseTemplate(input: string): ParsedToken[] {
  const result: ParsedToken[] = [];
  let currentPos = 0;
  let index = 0;
  while (currentPos < input.length) {
    index += 1;
    // 查找下一个 {{
    const slotStart = input.indexOf('{{', currentPos);

    // 如果没有找到 {{，剩余部分都是普通字符串
    if (slotStart === -1) {
      const remaining = input.slice(currentPos);
      if (remaining.length > 0) {
        result.push({ type: 'string', value: remaining, key: `str-${index}` });
      }
      break;
    }

    // 添加 {{ 之前的普通字符串部分
    if (slotStart > currentPos) {
      result.push({
        type: 'string',
        value: input.slice(currentPos, slotStart),
        key: `str-${index}`,
      });
    }

    // 查找对应的 }}
    const slotEnd = input.indexOf('}}', slotStart + 2);

    // 如果没有找到闭合的 }}，将剩余部分作为普通字符串
    if (slotEnd === -1) {
      result.push({
        type: 'string',
        value: input.slice(slotStart),
        key: `str-${index}`,
      });
      break;
    }

    // 提取 slot 内容（去除前后空格）
    const slotContent = input.slice(slotStart + 2, slotEnd).trim();
    result.push({ type: 'slot', value: slotContent, key: `slot-${slotContent}-${index}` });

    // 移动到 }} 之后
    currentPos = slotEnd + 2;
  }

  return result;
}

export const MkI18n = (props: {
  i18nKey?: string;
  i18nValue?: string | null;
  values?: Record<string, React.ReactNode>;
}) => {
  const { t } = useTranslation();
  const template = props.i18nKey ? t(props.i18nKey) : props.i18nValue;
  if (template == null) {
    throw new Error('MkI18n requires either i18nKey or i18nValue to be set.');
  }

  const parsed = useMemo(() => parseTemplate(template), [template]);

  return (
    <div className="mk-i18n" data-i18n-key={props.i18nKey}>
      {parsed.map((token) => {
        if (token.type === 'string') {
          return <Fragment key={token.key}>{token.value}</Fragment>;
        } else {
          const element = props.values?.[token.value];
          if (element != null) {
            return <Fragment key={token.key}>{element}</Fragment>;
          } else {
            return <Fragment key={token.key}>{`{{ ${token.value} }}`}</Fragment>;
          }
        }
      })}
    </div>
  );
};
