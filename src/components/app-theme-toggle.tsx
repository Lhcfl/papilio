/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { Button } from '@/components/ui/button';
import { usePreference } from '@/stores/perference';
import { SunMoonIcon } from 'lucide-react';

export function AppThemeToggle() {
  const setTheme = usePreference((p) => p.setTheme);

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
      }}
    >
      <SunMoonIcon />
    </Button>
  );
}
