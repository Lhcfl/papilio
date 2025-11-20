/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { createRoot } from 'react-dom/client';
import './tailwind.css';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import './plugins/i18n';
import { StrictMode } from 'react';
import { dehydrateOptions, localStoragePersister, queryClient } from '@/plugins/persister';
// Import the generated route tree
import { routeTree } from '@/routeTree.gen';
import { Spinner } from '@/components/ui/spinner';
import { AppDefaultErrorComponent } from '@/components/app-default-error-component';
import { loadFontCssByLocalStorage } from '@/lib/font';

// Create a new router instance
const router = createRouter({
  routeTree,
  scrollToTopSelectors: [`#main-scroll-area > [data-slot="scroll-area-viewport"]`],
  scrollRestoration: true,
  defaultPendingComponent: () => (
    <div className="flex w-full items-center p-4">
      <Spinner />
    </div>
  ),
  defaultErrorComponent: AppDefaultErrorComponent,
});

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister: localStoragePersister,
        dehydrateOptions: dehydrateOptions,
      }}
    >
      <RouterProvider router={router} />
    </PersistQueryClientProvider>
  </StrictMode>,
);

loadFontCssByLocalStorage();
