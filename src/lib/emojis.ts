/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

export const normalizeEmojiName = (str: string) => {
  const step1 = str.startsWith(':') ? str.slice(1, -1) : str;
  const [name, host] = step1.split('@') as [name: string, host: string | undefined];
  return [name, host === '.' || !host ? null : host] as const;
};
