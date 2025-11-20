/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { atom, getDefaultStore } from 'jotai';

export const fontAtom = atom('default');

// sorted alphabetically by name, but 'Default' and 'System UI' always first
export const AVAILABLE_FONTS = [
  { name: 'Default', value: 'default' },
  { name: 'System UI', value: 'ui' },
  { name: 'Arial', value: 'arial' },
  { name: 'Clear Han Serif (思源屏显臻宋)', value: 'clear-han-serif' },
  { name: 'Fusion Pixel 8px', value: 'fusion-pixel-8px' },
  { name: 'Fusion Pixel 10px', value: 'fusion-pixel-10px' },
  { name: 'Fusion Pixel 12px', value: 'fusion-pixel-12px' },
  { name: 'Lexend', value: 'lexend' },
  { name: 'LXGW WenKai (霞骛文楷)', value: 'lxgw-wenkai' },
  { name: 'Noto Sans', value: 'noto-sans' },
  { name: 'jf open 粉圓 (猫啃糖圆)', value: 'maokentangyuan' },
  { name: 'Times New Roman', value: 'times-new-roman' },
  { name: '峄山碑篆体 + 崇羲篆體', value: 'ysbzt' },
];

export async function loadFontCss(name: string) {
  if (name === 'default') {
    document.documentElement.removeAttribute('default-font');
    return;
  }
  await import(`@/assets/font-css/${name}.css`);
  document.documentElement.setAttribute('default-font', name);
}

export function loadFontCssByLocalStorage() {
  const font = localStorage.getItem('preference:default-font');
  const store = getDefaultStore();
  if (font != null) {
    store.set(fontAtom, font);
    void loadFontCss(font);
  }
}

export function setFontPreference(name: string) {
  const store = getDefaultStore();
  store.set(fontAtom, name);
  if (name === 'default') {
    localStorage.removeItem('preference:default-font');
  } else {
    localStorage.setItem('preference:default-font', name);
  }
  void loadFontCss(name);
}
