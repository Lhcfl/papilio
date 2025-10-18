/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { useIsMobile } from '@/hooks/use-mobile';
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from './ui/drawer';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem,
} from './ui/dropdown-menu';
import { Link, type LinkOptions } from '@tanstack/react-router';
import { Separator } from './ui/separator';
import { Button } from './ui/button';
import { useState, type ComponentProps } from 'react';
import { cn } from '@/lib/utils';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { ScrollArea } from './ui/scroll-area';

export type MenuItem = {
  type: 'item';
  id: string;
  icon?: React.ReactNode;
  label: React.ReactNode;
  variant?: 'default' | 'destructive';
  preventCloseOnClick?: boolean;
  disabled?: boolean;
  active?: boolean;
} & (
  | {
      onClick: (e: React.MouseEvent<HTMLElement>) => void;
    }
  | {
      to: LinkOptions;
    }
  | {
      href: string;
    }
);

export interface MenuSwitch {
  type: 'switch';
  id: string;
  label: React.ReactNode;
  value: boolean;
  onChange: (checked: boolean) => void;
}

export interface MenuLabel {
  type: 'label';
  id: string;
  label: React.ReactNode;
}

export interface MenuGroup {
  type: 'group';
  id: string;
  items: Menu;
}

export type Menu = (MenuGroup | MenuItem | null | undefined | false | MenuLabel | MenuSwitch)[];

function findFirstLabel(menu: Menu): React.ReactNode {
  for (const item of menu) {
    if (item && item.type === 'label') {
      return item.label;
    }
    if (item && item.type === 'group') {
      const label = findFirstLabel(item.items);
      if (label) return label;
    }
  }
}

export const MenuOrDrawer = (props: { children: React.ReactNode; menu: Menu }) => {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>{props.children}</DrawerTrigger>
        <DrawerContent>
          <DrawerTitle className="sr-only">{findFirstLabel(props.menu)}</DrawerTitle>
          <ScrollArea className="max-h-[75vh] flex flex-col">
            <div className="flex flex-col p-2">
              {GenerateDrawerMenu(props.menu, () => {
                setOpen(false);
              })}
            </div>
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{props.children}</DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="max-w-60 lg:max-w-75">
        {GenerateDropDownMenu(props.menu)}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const GenerateDropDownMenu = (menu: Menu) => {
  return menu.map((x, i) => {
    if (x === null) {
      const key = `separator-${i}`;
      return <DropdownMenuSeparator key={key} />;
    }
    if (x === false || x === undefined) {
      return null;
    }
    switch (x.type) {
      case 'group':
        return <DropdownMenuGroup key={x.id}>{GenerateDropDownMenu(x.items)}</DropdownMenuGroup>;
      case 'label':
        return (
          <DropdownMenuLabel className="text-muted-foreground" key={x.id}>
            {x.label}
          </DropdownMenuLabel>
        );
      case 'switch': {
        return (
          <DropdownMenuCheckboxItem
            key={x.id}
            checked={x.value}
            onCheckedChange={x.onChange}
            onSelect={(e) => {
              e.preventDefault();
            }}
          >
            {x.label}
          </DropdownMenuCheckboxItem>
        );
      }
      case 'item': {
        if ('onClick' in x) {
          return (
            <DropdownMenuItem
              key={x.id}
              onClick={x.onClick}
              variant={x.variant}
              onSelect={(ev) => {
                if (x.preventCloseOnClick) ev.preventDefault();
              }}
              disabled={x.disabled}
              className={cn({ 'bg-accent text-accent-foreground': x.active })}
            >
              {x.icon} {x.label}
            </DropdownMenuItem>
          );
        } else if ('to' in x) {
          return (
            <DropdownMenuItem
              key={x.id}
              asChild
              variant={x.variant}
              onSelect={(ev) => {
                if (x.preventCloseOnClick) ev.preventDefault();
              }}
              disabled={x.disabled}
              className={cn({ 'bg-accent text-accent-foreground': x.active })}
            >
              <Link {...x.to}>
                {x.icon} {x.label}
              </Link>
            </DropdownMenuItem>
          );
        } else if ('href' in x) {
          return (
            <DropdownMenuItem
              key={x.id}
              asChild
              variant={x.variant}
              onSelect={(ev) => {
                if (x.preventCloseOnClick) ev.preventDefault();
              }}
              disabled={x.disabled}
              className={cn({ 'bg-accent text-accent-foreground': x.active })}
            >
              <a href={x.href} target="_blank" rel="noopener noreferrer">
                {x.icon} {x.label}
              </a>
            </DropdownMenuItem>
          );
        }
      }
    }
  });
};

const GenerateDrawerMenu = (menu: Menu, setCloseMenu: () => void) => {
  return menu.map((x, i) => {
    if (x === null) {
      const key = `separator-${i}`;
      return <Separator key={key} />;
    }
    if (x === false || x === undefined) {
      return null;
    }
    switch (x.type) {
      case 'group':
        return (
          <div className="flex flex-col gap-1" key={x.id}>
            {GenerateDrawerMenu(x.items, setCloseMenu)}
          </div>
        );
      case 'label':
        return (
          <span className="text-sm text-muted-foreground px-2" key={x.id}>
            {x.label}
          </span>
        );
      case 'switch': {
        return (
          <div key={x.id} className="flex items-center gap-2">
            <Switch name={x.id} checked={x.value} onCheckedChange={x.onChange} id={x.id} className="mr-2" />
            <Label htmlFor={x.id} className="w-full py-2">
              {x.label}
            </Label>
          </div>
        );
      }
      case 'item': {
        if ('onClick' in x) {
          return (
            <DrawerButton
              key={x.id}
              onClick={(e) => {
                x.onClick(e);
                setCloseMenu();
              }}
              variant={x.variant ?? 'ghost'}
              disabled={x.disabled}
              className={cn({ 'bg-accent text-accent-foreground': x.active })}
            >
              {x.icon} {x.label}
            </DrawerButton>
          );
        } else if ('to' in x) {
          return (
            <DrawerButton
              key={x.id}
              asChild
              variant={x.variant ?? 'ghost'}
              disabled={x.disabled}
              className={cn({ 'bg-accent text-accent-foreground': x.active })}
            >
              <Link {...x.to}>
                {x.icon} {x.label}
              </Link>
            </DrawerButton>
          );
        } else if ('href' in x) {
          return (
            <DrawerButton
              key={x.id}
              asChild
              variant={x.variant ?? 'ghost'}
              disabled={x.disabled}
              className={cn({ 'bg-accent text-accent-foreground': x.active })}
            >
              <a href={x.href} target="_blank" rel="noopener noreferrer">
                {x.icon} {x.label}
              </a>
            </DrawerButton>
          );
        }
      }
    }
  });
};

const DrawerButton = ({ variant, className, ...props }: ComponentProps<typeof Button>) => {
  return (
    <Button
      className={cn(
        'justify-start h-fit',
        {
          'text-destructive hover:bg-destructive/10 focus:bg-destructive/10 dark:focus:bg-destructive/20 dark:hover:bg-destructive/20 focus:text-destructive hover:text-destructive &:*:[svg]:!text-destructive':
            variant === 'destructive',
        },
        className,
      )}
      variant="ghost"
      {...props}
    />
  );
};

export const LabelAndDescription = (props: { label: string; description: string }) => (
  <div className="flex flex-col items-baseline">
    <div>{props.label}</div>
    <div className="text-xs text-muted-foreground">{props.description}</div>
  </div>
);
