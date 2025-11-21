/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { MkMfm } from '@/components/mk-mfm';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupTextarea } from '@/components/ui/input-group';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import { Switch } from '@/components/ui/switch';
import { useProfileEditAction } from '@/hooks/use-profile-edit-actions';
import { useMe } from '@/stores/me';
import { CakeIcon, IdCardIcon, MapPinIcon, MessageCircleHeartIcon, SaveIcon } from 'lucide-react';
import { useId, useState } from 'react';
import { useTranslation } from 'react-i18next';

export function ProfileBaseInfoEdit() {
  const id = useId();
  const me = useMe();
  const { t } = useTranslation();

  const { mutate, isPending } = useProfileEditAction();

  const withId = (name: string) => `${id}:${name}`;
  const [name, setName] = useState(me.name);
  const [description, setDescription] = useState(me.description);
  const [birthday, setBirthday] = useState(me.birthday);
  const [location, setLocation] = useState(me.location);
  const [followedMessage, setFollowedMessage] = useState(me.followedMessage);
  const [isCat, setIsCat] = useState(me.isCat);

  const changed =
    name !== me.name ||
    description !== me.description ||
    birthday !== me.birthday ||
    location !== me.location ||
    followedMessage !== me.followedMessage ||
    isCat !== me.isCat;

  return (
    <form
      className="mt-2"
      onSubmit={(ev) => {
        ev.preventDefault();
        ev.stopPropagation();

        mutate({
          name,
          description,
          birthday,
          location,
          followedMessage,
          isCat,
        });
      }}
    >
      <FieldGroup>
        <FieldSet>
          <Field>
            <FieldLabel htmlFor={withId('name')}>{t('_profile.name')}</FieldLabel>
            <InputGroup>
              <InputGroupAddon>
                <IdCardIcon />
              </InputGroupAddon>
              <InputGroupInput
                id={withId('name')}
                name="name"
                value={name ?? ''}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </InputGroup>
          </Field>
          <Field>
            <FieldLabel htmlFor={withId('description')}>{t('_profile.description')}</FieldLabel>
            <InputGroup>
              <InputGroupTextarea
                id={withId('description')}
                name="description"
                value={description ?? ''}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
              />
              {description && (
                <InputGroupAddon align="block-end">
                  <div className="w-full">
                    <Separator />
                    <div className="my-2">{t('preview')}</div>
                    <div className="text-foreground font-normal">
                      <MkMfm text={description} />
                    </div>
                  </div>
                </InputGroupAddon>
              )}
            </InputGroup>
          </Field>
          <Field>
            <FieldLabel htmlFor={withId('birthday')}>{t('birthday')}</FieldLabel>
            <InputGroup>
              <InputGroupAddon>
                <CakeIcon />
              </InputGroupAddon>
              <InputGroupInput
                id={withId('birthday')}
                name="birthday"
                type="date"
                value={birthday ?? ''}
                onChange={(e) => {
                  setBirthday(e.target.value);
                }}
              />
            </InputGroup>
          </Field>
          <Field>
            <FieldLabel htmlFor={withId('location')}>{t('position')}</FieldLabel>
            <InputGroup>
              <InputGroupAddon>
                <MapPinIcon />
              </InputGroupAddon>
              <InputGroupInput
                id={withId('location')}
                name="location"
                value={location ?? ''}
                onChange={(e) => {
                  setLocation(e.target.value);
                }}
              />
            </InputGroup>
          </Field>
          <Field>
            <FieldLabel htmlFor={withId('followedMessage')}>{t('_profile.followedMessage')}</FieldLabel>
            <InputGroup>
              <InputGroupAddon>
                <MessageCircleHeartIcon />
              </InputGroupAddon>
              <InputGroupInput
                id={withId('followedMessage')}
                name="followedMessage"
                value={followedMessage ?? ''}
                onChange={(e) => {
                  setFollowedMessage(e.target.value);
                }}
              />
            </InputGroup>
            <FieldDescription>{t('_profile.followedMessageDescription')}</FieldDescription>
          </Field>
        </FieldSet>
        <Accordion type="multiple">
          <FieldSet>
            <AccordionItem value="advanced-settings" className="mb-2 overflow-hidden rounded-lg border last:border-b">
              <AccordionTrigger className="rounded-none px-3 hover:no-underline">
                {t('advancedSettings')}
              </AccordionTrigger>
              <AccordionContent className="border-t p-3">
                <Field className="flex-row">
                  <div className="w-fit flex-[0_0]">
                    <Switch checked={isCat} onCheckedChange={setIsCat} name="isCat" id={withId('isCat')} />
                  </div>
                  <div>
                    <FieldLabel htmlFor={withId('isCat')}>{t('flagAsCat')}</FieldLabel>
                    <FieldDescription>{t('flagAsCatDescription')}</FieldDescription>
                  </div>
                </Field>
              </AccordionContent>
            </AccordionItem>
          </FieldSet>
        </Accordion>
        {changed && (
          <FieldSet>
            <Field>
              <Button type="submit" disabled={isPending}>
                {isPending ? <Spinner /> : <SaveIcon />}
                {t('save')}
              </Button>
            </Field>
          </FieldSet>
        )}
      </FieldGroup>
    </form>
  );
}
