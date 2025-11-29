import type { LazyExoticComponent } from 'react';
import type { JSX } from 'react/jsx-runtime';

interface Setting<U extends boolean> {
  name: string;
  description?: string;
  experimental?: string;
  // Ok this is a bit tricky. I don't know how to type this properly.
  // It will cause circular type reference if I try to type it strictly.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  hidden?: (settings: any) => boolean;
  user?: U;
}

export function createSettingsPage<
  T extends {
    name: string;
    value: string;
    description: string;
    icon: React.ReactNode;
    categories: unknown[];
  },
>(x: T): T {
  return x;
}

export function createCategory<
  T extends {
    icon: React.ReactNode;
    name: string;
    description: 'TODO';
    items: unknown[];
  },
>(x: T): T {
  return x;
}

export interface EnumSetting<K extends string, V extends string[], U extends boolean> extends Setting<U> {
  kind: 'enum';
  key: K;
  defaultValue: V[number];
  values: V;
  valuesI18n?: string[] | [string, Record<string, string>][];
}

export interface SwitchSetting<K extends string, U extends boolean> extends Setting<U> {
  kind: 'switch';
  key: K;
  defaultValue: boolean;
}

export interface CustomSetting<K extends string, V, U extends boolean> extends Setting<U> {
  kind: 'custom';
  key: K;
  defaultValue: V;
  direction: 'right' | 'bottom';
  component: LazyExoticComponent<() => JSX.Element>;
}

export interface TextSetting<K extends string, U extends boolean> extends Setting<U> {
  kind: 'text';
  key: K;
  defaultValue: string;
}

export function createEnum<K extends string, Values extends string[], U extends boolean>(
  key: K,
  opts: {
    defaultValue: Values[number];
    values: Values;
    valuesI18n?: string[] | [string, Record<string, string>][];
  } & Setting<U>,
): EnumSetting<K, Values, U> {
  return { key, kind: 'enum' as const, ...opts };
}

export function createSwitch<K extends string, U extends boolean>(
  key: K,
  opts: {
    defaultValue: boolean;
  } & Setting<U>,
): SwitchSetting<K, U> {
  return { key, kind: 'switch' as const, ...opts };
}

export function createCustomSetting(
  component: LazyExoticComponent<() => JSX.Element>,
  opts: Setting<false> & { direction: 'right' | 'bottom' },
) {
  return {
    kind: 'custom' as const,
    component,
    ...opts,
  } as never;
}

export function createKeyedCustomSetting<K extends string, V, U extends boolean>(
  component: LazyExoticComponent<() => JSX.Element>,
  opts: Setting<U> & { direction: 'right' | 'bottom'; key: K; defaultValue: V },
): CustomSetting<K, V, U> {
  return {
    kind: 'custom' as const,
    component,
    ...opts,
  } as never;
}

export function createTextSetting<K extends string, U extends boolean>(
  key: K,
  opts: {
    defaultValue: string;
  } & Setting<U>,
): TextSetting<K, U> {
  return { key, kind: 'text' as const, ...opts };
}
