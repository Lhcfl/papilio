function toFeatures(f: readonly string[]): Record<string, boolean> {
  return Object.fromEntries(f.map((x) => [x, true]));
}

export const SharkeyFeaturesArr = ['editNotes', 'searchFiles'] as const;
export const SharkeyFeatures = toFeatures(SharkeyFeaturesArr) as ForkFeature;

export type ForkFeature = Partial<Record<(typeof SharkeyFeaturesArr)[number], boolean>>;
