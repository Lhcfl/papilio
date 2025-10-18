/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import type { BrowserImageResizerConfigWithConvertedOutput } from '@misskey-dev/browser-image-resizer';
import isAnimated from 'is-file-animated';

let isWebpSupportedCache: boolean | undefined;
export function isWebpSupported() {
  if (isWebpSupportedCache === undefined) {
    const canvas = window.document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    isWebpSupportedCache = canvas.toDataURL('image/webp').startsWith('data:image/webp');
  }
  return isWebpSupportedCache;
}

type CompressTypeMap = Record<string, Partial<BrowserImageResizerConfigWithConvertedOutput> | undefined>;

const compressTypeMap: CompressTypeMap = {
  'image/jpeg': { quality: 0.85, mimeType: 'image/webp' },
  'image/png': { quality: 0.85, mimeType: 'image/webp' },
  'image/webp': { quality: 0.85, mimeType: 'image/webp' },
  'image/svg+xml': { quality: 1, mimeType: 'image/webp' },
} as const;

const compressTypeMapFallback: CompressTypeMap = {
  'image/jpeg': { quality: 0.85, mimeType: 'image/jpeg' },
  'image/png': { quality: 0.85, mimeType: 'image/png' },
  'image/webp': { quality: 0.85, mimeType: 'image/jpeg' },
  'image/svg+xml': { quality: 1, mimeType: 'image/png' },
} as const;

export async function getCompressionConfig(
  file: File,
): Promise<Partial<BrowserImageResizerConfigWithConvertedOutput> | undefined> {
  const imgConfig = (isWebpSupported() ? compressTypeMap : compressTypeMapFallback)[file.type];
  if (!imgConfig || (await isAnimated(file))) {
    return;
  }

  return {
    maxWidth: 2048,
    maxHeight: 2048,
    debug: true,
    ...imgConfig,
  };
}

const mimeTypeMap: Record<string, string | undefined> = {
  'image/webp': 'webp',
  'image/jpeg': 'jpg',
  'image/png': 'png',
} as const;

export function mimeTypeToFileExtension(mimeType?: string): string | undefined {
  return mimeType ? mimeTypeMap[mimeType] : undefined;
}
