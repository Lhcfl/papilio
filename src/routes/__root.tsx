import { injectUserToken } from '@/services/inject-misskey-api';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Outlet, createRootRoute, redirect } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

export const Route = createRootRoute({
  beforeLoad: (ctx) => {
    if (!ctx.location.href.startsWith('/login')) {
      if (!injectUserToken()) {
        throw redirect({ to: '/login' });
      }
    }
  },
  component: () => (
    <>
      <Outlet />
      <TanStackRouterDevtools position="bottom-right" />
      <ReactQueryDevtools />
    </>
  ),
});
