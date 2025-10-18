/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { Button } from '@/components/ui/button';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { HomeIcon } from 'lucide-react';

export const Route = createFileRoute('/$missing')({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center">
      <div className="text-8xl p-4">🚧</div>
      <div className="p-2">Not implemented. Papilio is under active development.</div>
      <Button onClick={() => navigate({ to: '/' })}>
        <HomeIcon />
        Home
      </Button>
    </div>
  );
}
