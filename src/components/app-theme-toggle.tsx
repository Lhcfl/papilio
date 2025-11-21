/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { usePreference } from '@/stores/perference';
import { SunMoonIcon } from 'lucide-react';
import type { HTMLProps } from 'react';

export function AppThemeToggle(props: HTMLProps<HTMLButtonElement>) {
  const setTheme = usePreference((p) => p.setTheme);

  return (
    <button
      {...{ ...props, type: 'button' }}
      onClick={() => {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
      }}
    >
      <SunMoonIcon />
    </button>
  );
}
