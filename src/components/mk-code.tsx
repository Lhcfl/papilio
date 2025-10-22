/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { lazy, Suspense } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

const MkCodeHighlighted = lazy(() => import('./mk-code-highlight'));

export function MkCode({ code, language = 'plaintext' }: { code: string; language?: string | null }) {
  return (
    <div className="bg-accent relative rounded-md border">
      <span className="lang-tag text-muted-foreground absolute top-0 right-0 p-2 font-mono">{language}</span>
      <ScrollArea orientation="horizontal" className="flex overflow-x-auto p-2 text-sm md:p-4 lg:text-base">
        <div className="w-0 flex-[1_1_auto]">
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
