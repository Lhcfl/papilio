/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

export type Tab<T extends string = string> = {
  value: T;
  comp?: React.ReactNode;
  headerRight?: React.ReactNode;
} & (
  | {
      label: string;
      icon?: React.ReactNode;
    }
  | {
      label?: string;
      icon: React.ReactNode;
    }
);
