/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { lazy, Suspense, type HTMLProps } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { usePreference } from '@/stores/perference';
import { cn } from '@/lib/utils';

const MkCodeHighlighted = lazy(() => import('./mk-code-highlight'));

export function MkCodeUnhighlighted({ code, language = 'plaintext' }: { code: string; language?: string | null }) {
  return (
    <pre className="mk-code-fallback">
      <code className={language ? `language-${language}` : undefined}>{code}</code>
    </pre>
  );
}

/**
 * Lazy-loaded, syntax-highlighted code block.\
 * If data-saver mode is enabled, falls back to unhighlighted code block.\
 * Otherwise dynamically imports the shiki highlighter and renders the highlighted code.
 */
export function MkCode({
  code,
  language = 'plaintext',
  className,
  ...props
}: { code: string; language?: string | null } & HTMLProps<HTMLDivElement>) {
  const disableHighlight = usePreference((s) => s.dataSaverCode);

  return (
    <div className={cn('bg-accent relative rounded-md border text-sm lg:text-base', className)} {...props}>
      <span className="lang-tag text-muted-foreground absolute top-0 right-0 p-2 font-mono">{language}</span>
      <ScrollArea orientation="horizontal" className="flex overflow-x-auto p-2 md:p-4">
        <div className="w-0 flex-[1_1_auto]">
          {disableHighlight ? (
            <MkCodeUnhighlighted code={code} language={language} />
          ) : (
            <Suspense fallback={<MkCodeUnhighlighted code={code} language={language} />}>
              <MkCodeHighlighted code={code} language={language ?? 'plaintext'} />
            </Suspense>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
