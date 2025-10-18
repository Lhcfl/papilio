/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { DialogClose } from '@radix-ui/react-dialog';
import { createFileRoute } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import { LoginLayout } from '@/layouts/login-layout';
import { injectCurrentSite, saveToAccountList, storeUserToken } from '@/services/inject-misskey-api';
import { useQuery } from '@tanstack/react-query';

export const Route = createFileRoute('/login-redirect')({
  component: RouteComponent,
  validateSearch: (search) => {
    return {
      session: (search.session as string) || undefined,
    };
  },
  staticData: {
    noAuth: true,
  },
});

function RouteComponent() {
  const { session } = Route.useSearch();
  const navigate = useNavigate();
  const [error, setError] = useState(false);

  useQuery({
    queryKey: ['login-redirect', session],
    queryFn: () =>
      fetch(new URL(`/api/miauth/${session}/check`, injectCurrentSite()), {
        method: 'POST',
      })
        .then((res) => res.json() as Promise<{ ok: boolean; token: string }>)
        .then((res) => {
          if (res.ok) {
            storeUserToken(res.token);
            saveToAccountList({ site: injectCurrentSite(), token: res.token });
            window.location.href = new URL('/', window.location.origin).toString();
          } else {
            setError(true);
          }
          return true;
        }),

    enabled: !!session,
  });

  useEffect(() => {
    if (!session) {
      void navigate({ to: '/login' });
      return;
    }
  });

  const onOpenChange = (open: boolean) => {
    if (!open) {
      setError(false);
      void navigate({ to: '/login' });
    }
  };

  return (
    <LoginLayout>
      <Spinner />
      <Dialog open={error} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Error</DialogTitle>
            <DialogDescription>Failed to login. Please try again.</DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button">Try Again</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </LoginLayout>
  );
}
