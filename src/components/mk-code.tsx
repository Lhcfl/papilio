/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { lazy, Suspense } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

const MkCodeHighlighted = lazy(() => import('./mk-code-highlight'));

export function MkCode({ code, language = 'plaintext' }: { code: string; language?: string | null }) {
  return (
    <div className="relative border rounded-md bg-accent">
      <span className="lang-tag absolute right-0 top-0 p-2 text-muted-foreground font-mono">{language}</span>
      <ScrollArea orientation="horizontal" className="flex p-2 text-sm md:p-4 lg:text-base overflow-x-auto">
        <div className="flex-[1_1_auto] w-0">
          <Suspense
            fallback={
              <pre className="mk-code-fallback">
                <code className={language ? `language-${language}` : undefined}>{code}</code>
              </pre>
            }
          >
            <MkCodeHighlighted code={code} language={language ?? 'plaintext'} />
          </Suspense>
        </div>
      </ScrollArea>
    </div>
  );
}
