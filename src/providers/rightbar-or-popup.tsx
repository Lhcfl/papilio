/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { AppRightCard } from '@/components/app-right-card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DialogTitle } from '@radix-ui/react-dialog';
import { XIcon } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useMedia } from 'react-use';

export const RIGHTBAR_ID = 'rbropi';

export const RightbarOrPopup = (props: {
  title?: React.ReactNode;
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (show: boolean) => void;
  hideClose?: boolean;
}) => {
  const { children, title, open, onOpenChange, hideClose } = props;
  const hideRightbar = useMedia('(max-width: 64rem)', false);

  if (hideRightbar) {
    return (
      <Dialog onOpenChange={onOpenChange} open={open}>
        <DialogContent className="top-6 translate-y-0 p-0" showCloseButton={!hideClose}>
          <ScrollArea className="max-h-[calc(100vh_-_8em)]">
            <DialogHeader>
              <DialogTitle>
                <div className="flex items-center justify-between">{title}</div>
              </DialogTitle>
            </DialogHeader>
            {children}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    );
  }

  if (open) {
    return createPortal(
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">{title}</div>
          {!hideClose && (
            <div>
              <Button
                onClick={() => {
                  onOpenChange(false);
                }}
                variant="ghost"
              >
                <XIcon />
              </Button>
            </div>
          )}
        </div>
        {children}
      </div>,
      document.getElementById(RIGHTBAR_ID)!,
    );
  }

  return null;
};

export const DesktopRightbar = () => {
  return (
    <div className="right-card-container bg-sidebar relative border-l max-lg:hidden">
      <ScrollArea className="h-screen w-110 p-2 xl:w-120 2xl:w-130">
        <div id={RIGHTBAR_ID}>
          <AppRightCard className="hidden h-[calc(100vh-var(--spacing)*4)] [&:last-child]:flex" />
        </div>
      </ScrollArea>
    </div>
  );
};
