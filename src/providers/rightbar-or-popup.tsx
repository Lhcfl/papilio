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

export const RIGHTBAR_OR_POPUP_ID = 'rbropi';
export const RIGHTBAR_OR_POPUP_HEADERLEFT = `${RIGHTBAR_OR_POPUP_ID}__hdl`;
export const RIGHTBAR_OR_POPUP_HEADERRIGHT = `${RIGHTBAR_OR_POPUP_ID}__hdr`;

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
        <ScrollArea id={RIGHTBAR_OR_POPUP_ID} className="max-h-[calc(100vh_-_8em)] px-4 pt-4 pb-2">
          <DialogHeader>
            <DialogTitle>
              <div className="flex items-center justify-between">
                <div id={RIGHTBAR_OR_POPUP_HEADERLEFT} />
                {title}
                <div id={RIGHTBAR_OR_POPUP_HEADERRIGHT} />
              </div>
            </DialogTitle>
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
    <div className="right-card-container bg-sidebar relative border-l max-lg:hidden">
      {node && !closing ? (
        <ScrollArea id={RIGHTBAR_OR_POPUP_ID} className="h-screen w-110 p-2 xl:w-120 2xl:w-130">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div id={RIGHTBAR_OR_POPUP_HEADERLEFT} />
              {title}
            </div>
            <div>
              <div id={RIGHTBAR_OR_POPUP_HEADERRIGHT} />
              <Button onClick={close} variant="ghost">
                <XIcon />
              </Button>
            </div>
          </div>
          {node}
        </ScrollArea>
      ) : (
        <div className="h-screen w-80 lg:w-100 xl:w-115 2xl:w-130">
          <AppRightCard />
        </div>
      )}
    </div>
  );
};
