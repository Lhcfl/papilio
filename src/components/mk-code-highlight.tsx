/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

// It's a code highlight component, so disabling the rule about array index as key is acceptable
/* eslint-disable react-x/no-array-index-key */

import { cn } from '@/lib/utils';
import { usePerference } from '@/stores/perference';
import { useQuery } from '@tanstack/react-query';
import { Fragment, useMemo } from 'react';
import { codeToTokens, bundledLanguages, bundledLanguagesAlias } from 'shiki';
import MurmurHash3 from 'imurmurhash';

const FontStyle = {
  NotSet: -1,
  None: 0,
  Italic: 1,
  Bold: 2,
  Underline: 4,
  Strikethrough: 8,
};

export default function MkCodeHighlight(props: { code: string; language: string }) {
  const { language, code } = props;
  const theme = usePerference((s) => s.theme);
  const codeHash = useMemo(() => new MurmurHash3(code).result(), [code]);

  const { data: tokens } = useQuery({
    queryKey: ['code-tokens', codeHash, language, theme],
    queryFn: () =>
      codeToTokens(code, {
        lang: language as keyof typeof bundledLanguages,
        theme: theme === 'dark' ? 'github-dark' : 'github-light',
      }),
    enabled: language in bundledLanguages || language in bundledLanguagesAlias,
    staleTime: Infinity,
  });

  if (tokens == null) {
    return (
      <pre className="mk-code-fallback">
        <code className={language ? `language-${language}` : undefined}>{code}</code>
      </pre>
    );
  }

  return (
    <pre className="mk-code-highlight">
      <code>
        {tokens.tokens.map((line, i) => (
          <Fragment key={i}>
            {line.map((token, j) => (
              <span
                key={j}
                style={{ color: token.color ?? undefined }}
                className={cn(
                  token.fontStyle && {
                    'font-bold': (token.fontStyle & FontStyle.Bold) !== 0,
                    italic: (token.fontStyle & FontStyle.Italic) !== 0,
                    underline: (token.fontStyle & FontStyle.Underline) !== 0,
                    'line-through': (token.fontStyle & FontStyle.Strikethrough) !== 0,
                  },
                )}
              >
                {token.content}
              </span>
            ))}
            {'\n'}
          </Fragment>
        ))}
      </code>
    </pre>
  );
}
