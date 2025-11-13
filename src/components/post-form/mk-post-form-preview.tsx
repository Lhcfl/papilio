/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { MfmNode } from 'mfm-js';
import type { UserLite } from '@/types/user';
import { MkAvatar } from '@/components/mk-avatar';
import { MkUserName } from '@/components/mk-user-name';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@radix-ui/react-accordion';
import { MkMfm } from '@/components/mk-mfm';
import type { HTMLProps } from 'react';

export const MkPostFormPreview = ({
  showPreview,
  user,
  hasCw,
  cw,
  text,
  parsedText,
  ...props
}: {
  showPreview: boolean;
  user: UserLite;
  className: string;
  hasCw: boolean;
  cw: string;
  text: string;
  parsedText: MfmNode[];
} & HTMLProps<HTMLDivElement>) => {
  if (!showPreview) return null;
  return (
    <div {...props}>
      <div>
        <MkAvatar user={user} avatarProps={{ className: 'size-12' }} />
      </div>
      <div className="flex w-full flex-col gap-2 text-sm">
        <MkUserName user={user} />
        {hasCw ? (
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="cw">
              <AccordionTrigger className="mb-2 p-0">
                <MkMfm text={cw} />
              </AccordionTrigger>
              <AccordionContent>
                <MkMfm text={text} parsedNodes={parsedText} />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ) : (
          <MkMfm text={text} parsedNodes={parsedText} />
        )}
      </div>
    </div>
  );
};
