/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

function toFeatures(f: readonly string[]): Record<string, boolean> {
  return Object.fromEntries(f.map((x) => [x, true]));
}

export const SharkeyFeaturesArr = ['editNotes', 'searchFiles', 'noNeedGetNoteState'] as const;
export const SharkeyFeatures = toFeatures(SharkeyFeaturesArr) as ForkFeature;

export type ForkFeature = Partial<Record<(typeof SharkeyFeaturesArr)[number], boolean>>;
