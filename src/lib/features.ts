/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

function toFeatures(f: readonly string[]): Record<string, boolean> {
  return Object.fromEntries(f.map((x) => [x, true]));
}

export const MisskeyFeaturesArr = ['avatarDecorations'] as const;

export const SharkeyFeaturesArr = [
  'editNotes',
  'avatarDecorations',
  'searchFiles',
  'noNeedGetNoteState',
  'refreshPoll',
  'quotePage',
] as const;
export const SharkeyFeatures = toFeatures(SharkeyFeaturesArr) as ForkFeature;

export const IceShrimpFeaturesArr = ['editNotes'] as const;
export const IceShrimpFeatures = toFeatures(IceShrimpFeaturesArr) as ForkFeature;

export type ForkFeature = Partial<
  Record<
    (typeof SharkeyFeaturesArr)[number] | (typeof IceShrimpFeaturesArr)[number] | (typeof MisskeyFeaturesArr)[number],
    boolean
  >
>;
