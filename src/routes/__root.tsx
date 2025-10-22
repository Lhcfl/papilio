/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { Toaster } from '@/components/ui/sonner';
import { useMainChannelListener } from '@/hooks/use-main-channel';
import { useNoteUpdateListener } from '@/hooks/use-note';
import { useUploadingHint } from '@/hooks/use-uploading-hint';
import { WithLoginLoader } from '@/loaders/with-login';
import { ConfirmDialogProvider } from '@/providers/confirm-dialog-provider';
import { ErrorDialogProvider } from '@/providers/error-dialog-provider';
import { token } from '@/services/inject-misskey-api';
import { usePerference } from '@/stores/perference';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Outlet, createRootRoute, redirect, useChildMatches } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { useEffect } from 'react';

export const Route = createRootRoute({
  beforeLoad: (ctx) => {
    if (!ctx.matches.at(-1)?.staticData.noAuth) {
      if (token == null) {
        return redirect({ to: '/login' });
      }
    }
  },
  component: RootRouteComponent,
});

function RootRouteComponent() {
  const theme = usePerference((p) => p.theme);
  const shouldLogin = useChildMatches({
    select: (matches) => !matches.some((x) => x.staticData.noAuth === true),
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [theme]);

  return (
    <>
      {shouldLogin ? (
        <WithLoginLoader>
          <GlobalLoggedInEffects />
          <Outlet />
        </WithLoginLoader>
      ) : (
        <Outlet />
      )}
      <ConfirmDialogProvider />
      <ErrorDialogProvider />
      <TanStackRouterDevtools position="bottom-right" />
      <ReactQueryDevtools />
      <Toaster richColors theme={theme} />
    </>
  );
}

function GlobalLoggedInEffects() {
  useNoteUpdateListener();
  useMainChannelListener();
  useUploadingHint();

  return null;
}
