/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { AlertCircleIcon } from 'lucide-react';
import { Item, ItemContent, ItemMedia } from './ui/item';

export const MkAlert = (props: { children: React.ReactNode }) => {
  return (
    <Item variant="muted">
      <ItemMedia variant="icon">
        <AlertCircleIcon />
      </ItemMedia>
      <ItemContent>{props.children}</ItemContent>
    </Item>
  );
};
