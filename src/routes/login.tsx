/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { createFileRoute } from '@tanstack/react-router';
import { permissions } from 'misskey-js';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { Spinner } from '@/components/ui/spinner';
import { LoginLayout } from '@/layouts/login-layout';
import {
  getAccountList,
  injectCurrentSiteOrNull,
  injectUserToken,
  saveToAccountList,
  storeUserSite,
} from '@/services/inject-misskey-api';

export const Route = createFileRoute('/login')({
  component: RouteComponent,
  staticData: {
    noAuth: true,
  },
});

function RouteComponent() {
  const { t } = useTranslation();

  const [domain, updateDomain] = useState('');
  const [customName, updateCustomName] = useState('Papilio the another Misskey Client');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate({ from: '/login' });

  useEffect(() => {
    const search = new URLSearchParams(window.location.search);
    if (search.has('noredirect')) {
      const site = injectCurrentSiteOrNull();
      const token = injectUserToken();
      if (token != null) {
        saveToAccountList({ site, token });
        if (import.meta.env.DEV) {
          console.log('saved account from login with noredirect:', { site, token });
          console.log(getAccountList());
        }
      }
    } else {
      const list = getAccountList();
      if (list.length > 1) {
        void navigate({ to: '/account-switch' });
        return;
      } else {
        void navigate({ to: '/' });
        return;
      }
    }
  }, [navigate]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const session = crypto.randomUUID();

    const site = domain.startsWith('https://') || domain.startsWith('http://') ? domain : `https://${domain}`;

    storeUserSite(site);

    const url = new URL(`/miauth/${session}`, site);

    url.searchParams.append('name', customName);
    url.searchParams.append('callback', `${window.location.origin}/login-redirect`);
    url.searchParams.append('permission', permissions.join(','));

    console.log(url.toString());

    setLoading(true);
    window.location.href = url.toString();
  };

  return (
    <LoginLayout>
      <form className="flex flex-col gap-6 max-w-xs w-full" onSubmit={onSubmit}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-1 text-center">
            <h1 className="text-2xl font-bold">{t('login')}</h1>
          </div>
          <Field>
            <FieldLabel htmlFor="domain">Enter your instance's domain</FieldLabel>
            <InputGroup>
              <InputGroupAddon>https://</InputGroupAddon>
              <InputGroupInput
                id="domain"
                type="text"
                placeholder="example.com"
                required
                onChange={(e) => {
                  updateDomain(e.target.value);
                }}
              />
            </InputGroup>
          </Field>
          <Field>
            <FieldLabel htmlFor="custom-name">If you want, you can also provide a custom name for the app</FieldLabel>
            <InputGroup>
              <InputGroupInput
                id="custom-name"
                type="text"
                placeholder="Custom Name"
                required
                value={customName}
                onChange={(e) => {
                  updateCustomName(e.target.value);
                }}
              />
            </InputGroup>
          </Field>
          <Field>
            <Button type="submit">
              {loading && <Spinner />}
              {t('login')}
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </LoginLayout>
  );
}
