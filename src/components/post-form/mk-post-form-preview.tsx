import type { MfmNode } from 'mfm-js';
import type { UserLite } from 'misskey-js/entities.js';
import { MkAvatar } from '../mk-avatar';
import { MkUserName } from '../mk-user-name';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@radix-ui/react-accordion';
import { MkMfm } from '../mk-mfm';
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
      <div className="flex flex-col text-sm gap-2 w-full">
        <MkUserName user={user} />
        {hasCw ? (
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="cw">
              <AccordionTrigger className="p-0 mb-2">
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
