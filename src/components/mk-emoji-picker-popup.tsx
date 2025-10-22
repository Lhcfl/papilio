/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { useState } from 'react';

import type { EmojiSimple } from 'misskey-js/entities.js';
import { MkEmojiPicker } from '@/components/mk-emoji-picker';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useIsMobile } from '@/hooks/use-mobile';
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';

export const MkEmojiPickerPopup = (props: {
  onEmojiChoose: (emoji: EmojiSimple | string) => void;
  autoClose?: boolean;
  children: React.ReactNode;
  onClose?: () => void;
}) => {
  const [show, setShow] = useState(false);
  const isMobile = useIsMobile();

  function onOpenChange(open: boolean) {
    setShow(open);
    if (!open && props.onClose) props.onClose();
  }

  function onEmojiChoose(emoji: EmojiSimple | string) {
    props.onEmojiChoose(emoji);
    if (props.autoClose) setShow(false);
  }

  if (isMobile) {
    return (
      <Drawer open={show} onOpenChange={onOpenChange}>
        <DrawerTrigger asChild>{props.children}</DrawerTrigger>
        <DrawerContent>
          <DrawerTitle className="sr-only">Emoji Picker</DrawerTitle>
          <MkEmojiPicker className="h-150" onEmojiChoose={onEmojiChoose} />
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Popover open={show} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>{props.children}</PopoverTrigger>
      <PopoverContent className="h-fit w-fit">
        <MkEmojiPicker
          onEmojiChoose={onEmojiChoose}
          className="h-100 max-h-100 w-100 max-w-100 lg:h-120 lg:max-h-120 lg:w-120 lg:max-w-120"
        />
      </PopoverContent>
    </Popover>
  );
};
