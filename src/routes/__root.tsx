import { ConfirmDialogProvider } from '@/providers/confirm-dialog-provider';
import { injectUserToken } from '@/services/inject-misskey-api';
import { usePerference } from '@/stores/perference';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Outlet, createRootRoute, redirect } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { useEffect } from 'react';

export const Route = createRootRoute({
  beforeLoad: (ctx) => {
    if (!ctx.matches.at(-1)?.staticData.noAuth) {
      if (!injectUserToken()) {
        return redirect({ to: '/login' });
      }
    }
  },
  component: RootRouteComponent,
});

function RootRouteComponent() {
  const theme = usePerference((p) => p.theme);
  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [theme]);

  return (
    <>
      <Outlet />
      <ConfirmDialogProvider />
      <TanStackRouterDevtools position="bottom-right" />
      <ReactQueryDevtools />
    </>
  );
}
