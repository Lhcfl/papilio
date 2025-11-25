/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { CheckIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function InputModal({
  value,
  updateValue,
  title,
  description,
  onOk,
  prefixIcon,
  children,
}: {
  value: string;
  updateValue: (value: string) => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  onOk: () => void;
  prefixIcon?: React.ReactNode;
  children?: React.ReactNode;
}) {
  const { t } = useTranslation();

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
        <InputGroup>
          {prefixIcon && <InputGroupAddon>{prefixIcon}</InputGroupAddon>}
          <InputGroupInput
            value={value}
            onChange={(e) => {
              updateValue(e.target.value);
            }}
          />
        </InputGroup>
        <DialogFooter>
          <DialogClose>
            <Button onClick={onOk}>
              <CheckIcon />
              {t('ok')}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
