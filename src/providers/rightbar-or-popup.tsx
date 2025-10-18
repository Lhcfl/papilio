/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { AppRightCard } from '@/components/app-right-card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useRightbarOrPopup } from '@/stores/rightbar-or-poup';
import { DialogTitle } from '@radix-ui/react-dialog';
import { XIcon } from 'lucide-react';
import { useMedia } from 'react-use';

export const RightbarOrPopupProvider = () => {
  const isMobile = useMedia('(max-width: 64rem)', false);
  return isMobile ? <MobilePopup /> : <DesktopRightbar />;
};

const MobilePopup = () => {
  const title = useRightbarOrPopup((s) => s.title);
  const node = useRightbarOrPopup((s) => s.node);
  const close = useRightbarOrPopup((s) => s.close);
  const closing = useRightbarOrPopup((s) => s.closing);

  return (
    <Dialog
      onOpenChange={(o) => {
        if (!o) {
          close();
        }
      }}
      open={!!node && !closing}
    >
      <DialogContent className="p-0">
        <ScrollArea className="px-4 pt-4 pb-2 max-h-[calc(100vh_-_8em)]">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          {node}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

const DesktopRightbar = () => {
  const node = useRightbarOrPopup((s) => s.node);
  const title = useRightbarOrPopup((s) => s.title);
  const closing = useRightbarOrPopup((s) => s.closing);
  const close = useRightbarOrPopup((s) => s.close);

  return (
    <div className="right-card-container border-l max-lg:hidden relative">
      {node && !closing ? (
        <ScrollArea className="w-110 xl:w-120 h-screen p-2">
          <div className="flex items-center justify-between">
            <div>{title}</div>
            <Button onClick={close} variant="ghost">
              <XIcon />
            </Button>
          </div>
          {node}
        </ScrollArea>
      ) : (
        <AppRightCard />
      )}
    </div>
  );
};
