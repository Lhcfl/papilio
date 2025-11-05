/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import type { DraftData } from '@/hooks/use-draft';
import { ArrowDownIcon, ArrowUpIcon, Trash2Icon } from 'lucide-react';
import type { HTMLProps } from 'react';
import { useTranslation } from 'react-i18next';

export function MkPostFormPoll({
  poll,
  setPoll,
  ...props
}: {
  setPoll: (poll: DraftData['poll']) => void;
  poll: DraftData['poll'];
} & HTMLProps<HTMLDivElement>) {
  const { t } = useTranslation();

  function updateChoice(index: number, value: string) {
    const newChoices = [...poll.choices];
    newChoices[index] = value;
    setPoll({ ...poll, choices: newChoices });
  }

  function removeChoice(index: number) {
    const newChoices = [...poll.choices];
    newChoices.splice(index, 1);
    setPoll({ ...poll, choices: newChoices });
  }

  function moveChoiceUp(index: number) {
    if (index === 0) return;
    const newChoices = [...poll.choices];
    const temp = newChoices[index - 1];
    newChoices[index - 1] = newChoices[index];
    newChoices[index] = temp;
    setPoll({ ...poll, choices: newChoices });
  }

  function moveChoiceDown(index: number) {
    if (index === poll.choices.length - 1) return;
    const newChoices = [...poll.choices];
    const temp = newChoices[index + 1];
    newChoices[index + 1] = newChoices[index];
    newChoices[index] = temp;
    setPoll({ ...poll, choices: newChoices });
  }

  return (
    <div {...props}>
      <div>
        {[...poll.choices, ''].map((choice, index) => (
          <InputGroup
            // eslint-disable-next-line react-x/no-array-index-key
            key={index}
            className="mb-2"
          >
            <InputGroupInput
              value={choice}
              placeholder={index == poll.choices.length ? t('add') : t('_poll.choiceN', { n: index + 1 })}
              onChange={(ev) => {
                updateChoice(index, ev.target.value);
              }}
            />
            {index != poll.choices.length && (
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
                  disabled={index === poll.choices.length - 1}
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
      <div>
        <Label>
          <Switch
            checked={poll.multiple}
            onCheckedChange={(multiple) => {
              setPoll({ ...poll, multiple });
            }}
          />
          {t('_poll.canMultipleVote')}
        </Label>
      </div>
    </div>
  );
}
