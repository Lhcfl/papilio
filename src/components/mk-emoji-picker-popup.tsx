/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { useState } from 'react';

import type { EmojiSimple } from 'misskey-js/entities.js';
import { MkEmojiPicker } from './mk-emoji-picker';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

export const MkEmojiPickerPopup = (props: {
  onEmojiChoose: (emoji: EmojiSimple | string) => void;
  autoClose?: boolean;
  children: React.ReactNode;
  onClose?: () => void;
}) => {
  const [show, setShow] = useState(false);

  function onOpenChange(open: boolean) {
    setShow(open);
    if (!open && props.onClose) props.onClose();
  }

  function onEmojiChoose(emoji: EmojiSimple | string) {
    props.onEmojiChoose(emoji);
    if (props.autoClose) setShow(false);
  }

  return (
    <Popover open={show} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>{props.children}</PopoverTrigger>
      <PopoverContent className="w-fit h-fit">
        <MkEmojiPicker onEmojiChoose={onEmojiChoose} />
      </PopoverContent>
    </Popover>
  );
};
