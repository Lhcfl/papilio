import { useIsMobile } from '@/hooks/use-mobile';
import { Drawer, DrawerContent, DrawerTrigger } from './ui/drawer';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuLabel,
} from './ui/dropdown-menu';
import { Link } from '@tanstack/react-router';
import { Separator } from './ui/separator';
import { Button } from './ui/button';
import { useState, type ComponentProps } from 'react';
import { cn } from '@/lib/utils';

export type MenuItem = {
  type: 'item';
  id: string;
  icon?: React.ReactNode;
  label: React.ReactNode;
  variant?: 'default' | 'destructive';
} & (
  | {
      onClick: (e: React.MouseEvent<HTMLElement>) => void;
    }
  | {
      to: string;
    }
  | {
      href: string;
    }
);

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

export type Menu = (MenuGroup | MenuItem | null | undefined | false | MenuLabel)[];

export const MenuOrDrawer = (props: { children: React.ReactNode; menu: Menu }) => {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>{props.children}</DrawerTrigger>
        <DrawerContent>
          <div className="flex flex-col p-2">
            {GenerateDrawerMenu(props.menu, () => {
              setOpen(false);
            })}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{props.children}</DropdownMenuTrigger>
      <DropdownMenuContent align="start">{GenerateDropDownMenu(props.menu)}</DropdownMenuContent>
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
        return <DropdownMenuLabel key={x.id}>{x.label}</DropdownMenuLabel>;
      case 'item': {
        if ('onClick' in x) {
          return (
            <DropdownMenuItem key={x.id} onClick={x.onClick} variant={x.variant}>
              {x.icon} {x.label}
            </DropdownMenuItem>
          );
        } else if ('to' in x) {
          return (
            <DropdownMenuItem key={x.id} asChild variant={x.variant}>
              <Link to={x.to}>
                {x.icon} {x.label}
              </Link>
            </DropdownMenuItem>
          );
        } else if ('href' in x) {
          return (
            <DropdownMenuItem key={x.id} asChild variant={x.variant}>
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
          <span className="text-sm text-muted" key={x.id}>
            {x.label}
          </span>
        );
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
            >
              {x.icon} {x.label}
            </DrawerButton>
          );
        } else if ('to' in x) {
          return (
            <DrawerButton key={x.id} asChild variant={x.variant ?? 'ghost'}>
              <Link to={x.to}>
                {x.icon} {x.label}
              </Link>
            </DrawerButton>
          );
        } else if ('href' in x) {
          return (
            <DrawerButton key={x.id} asChild variant={x.variant ?? 'ghost'}>
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

const DrawerButton = ({ variant, ...props }: ComponentProps<typeof Button>) => {
  return (
    <Button
      className={cn('justify-start', {
        'text-destructive hover:bg-destructive/10 focus:bg-destructive/10 dark:focus:bg-destructive/20 dark:hover:bg-destructive/20 focus:text-destructive hover:text-destructive &:*:[svg]:!text-destructive':
          variant === 'destructive',
      })}
      variant="ghost"
      {...props}
    />
  );
};
