/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { Input } from '@/ui/input';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/ui/input-group';
import { Label } from '@/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select';
import { Switch } from '@/ui/switch';
import type { DraftData } from '@/hooks/draft';
import { toDatetimeLocalValue } from '@/lib/utils';
import { ArrowDownIcon, ArrowUpIcon, Trash2Icon } from 'lucide-react';
import { useState, type HTMLProps } from 'react';
import { useTranslation } from 'react-i18next';

export function MkPostFormPoll({
  poll,
  setPoll,
  ...props
}: {
  setPoll: (poll: DraftData['poll']) => void;
  poll: DraftData['poll'];
} & HTMLProps<HTMLDivElement>) {
  const { multiple, choices, expiresAt, expiredAfter } = poll;
  const { t } = useTranslation();
  const expiresOpt = expiresAt ? 'expiresAt' : expiredAfter ? 'expiredAfter' : 'infinite';
  const [expiredAfterOpt, setExpiredAfterOpt] = useState('day' as 'second' | 'minute' | 'hour' | 'day');
  const [minExpiresAt] = useState(() => toDatetimeLocalValue(new Date()));
  const expiredAfterValue = Math.round(
    expiredAfter
      ? expiredAfterOpt === 'second'
        ? Math.floor(expiredAfter / 1000)
        : expiredAfterOpt === 'minute'
          ? Math.floor(expiredAfter / (60 * 1000))
          : expiredAfterOpt === 'hour'
            ? Math.floor(expiredAfter / (60 * 60 * 1000))
            : Math.floor(expiredAfter / (24 * 60 * 60 * 1000))
      : 1,
  );

  function setExpiresOpt(value: string) {
    const currentExpiresAt =
      expiresAt ?? (expiredAfter && Date.now() + expiredAfter) ?? Date.now() + 3 * 24 * 60 * 60 * 1000;

    switch (value) {
      case 'infinite':
        setPoll({ ...poll, expiresAt: null, expiredAfter: null });
        break;
      case 'expiresAt':
        setPoll({ ...poll, expiresAt: currentExpiresAt, expiredAfter: null });
        break;
      case 'expiredAfter':
        setPoll({ ...poll, expiresAt: null, expiredAfter: currentExpiresAt - Date.now() });
        break;
    }
  }

  function updateChoice(index: number, value: string) {
    const newChoices = [...choices];
    newChoices[index] = value;
    setPoll({ ...poll, choices: newChoices });
  }

  function removeChoice(index: number) {
    const newChoices = [...choices];
    newChoices.splice(index, 1);
    setPoll({ ...poll, choices: newChoices });
  }

  function moveChoiceUp(index: number) {
    if (index === 0) return;
    const newChoices = [...choices];
    const temp = newChoices[index - 1];
    newChoices[index - 1] = newChoices[index];
    newChoices[index] = temp;
    setPoll({ ...poll, choices: newChoices });
  }

  function moveChoiceDown(index: number) {
    if (index === choices.length - 1) return;
    const newChoices = [...choices];
    const temp = newChoices[index + 1];
    newChoices[index + 1] = newChoices[index];
    newChoices[index] = temp;
    setPoll({ ...poll, choices: newChoices });
  }

  const expiresOptions = [
    { value: 'infinite', label: t('_poll.infinite') },
    { value: 'expiresAt', label: t('_poll.at') },
    { value: 'expiredAfter', label: t('_poll.after') },
  ];
  const durationUnitOptions = [
    { value: 'second', label: t('_time.second') },
    { value: 'minute', label: t('_time.minute') },
    { value: 'hour', label: t('_time.hour') },
    { value: 'day', label: t('_time.day') },
  ];

  return (
    <div {...props}>
      <div>
        {[...choices, ''].map((choice, index) => (
          <InputGroup
            // oxlint-disable-next-line react/no-array-index-key
            key={index}
            className="mb-2"
          >
            <InputGroupInput
              value={choice}
              placeholder={index == choices.length ? t('add') : t('_poll.choiceN', { n: index + 1 })}
              onChange={(ev) => {
                updateChoice(index, ev.target.value);
              }}
            />
            {index != choices.length && (
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  disabled={index === 0}
                  onClick={() => {
                    moveChoiceUp(index);
                  }}
                >
                  <ArrowUpIcon />
                </InputGroupButton>
                <InputGroupButton
                  disabled={index === choices.length - 1}
                  onClick={() => {
                    moveChoiceDown(index);
                  }}
                >
                  <ArrowDownIcon />
                </InputGroupButton>
                <InputGroupButton
                  onClick={() => {
                    removeChoice(index);
                  }}
                >
                  <Trash2Icon />
                </InputGroupButton>
              </InputGroupAddon>
            )}
          </InputGroup>
        ))}
      </div>
      <div className="mb-2">
        <Label>
          <Switch
            checked={multiple}
            onCheckedChange={(multiple) => {
              setPoll({ ...poll, multiple });
            }}
          />
          {t('_poll.canMultipleVote')}
        </Label>
      </div>
      <div className="flex items-center gap-2 @max-md:flex-col">
        <Label className="w-full">
          <span className="flex-shrink-0">{t('_poll.deadlineDate')}</span>
          <Select
            value={expiresOpt}
            onValueChange={(v) => {
              if (v != null) setExpiresOpt(v);
            }}
            items={expiresOptions}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {expiresOptions.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Label>
        {expiresAt && (
          <Label className="w-full">
            <span className="flex-shrink-0">{t('dateAndTime')}</span>
            <Input
              className="text-sm"
              type="datetime-local"
              min={minExpiresAt}
              value={toDatetimeLocalValue(new Date(expiresAt))}
              name="expiresAt"
              onChange={(ev) => {
                setPoll({ ...poll, expiredAfter: null, expiresAt: new Date(ev.target.value).getTime() });
              }}
            />
          </Label>
        )}
        {expiredAfter && (
          <InputGroup className="w-full">
            <InputGroupInput
              type="number"
              min={1}
              step={1}
              value={expiredAfterValue}
              onChange={(ev) => {
                const v = Number(ev.target.value);
                setPoll({
                  ...poll,
                  expiresAt: null,
                  expiredAfter:
                    expiredAfterOpt === 'second'
                      ? v * 1000
                      : expiredAfterOpt === 'minute'
                        ? v * 60 * 1000
                        : expiredAfterOpt === 'hour'
                          ? v * 60 * 60 * 1000
                          : v * 24 * 60 * 60 * 1000,
                });
              }}
            />
            <InputGroupAddon align="inline-end">
              <Select
                value={expiredAfterOpt}
                onValueChange={(v) => {
                  if (v != null) setExpiredAfterOpt(v);
                }}
                items={durationUnitOptions}
              >
                <SelectTrigger size="sm" className="border-none pr-1 shadow-none">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {durationUnitOptions.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </InputGroupAddon>
          </InputGroup>
        )}
      </div>
    </div>
  );
}
