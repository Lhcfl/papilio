/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { render } from 'buraha';

addEventListener('message', (event: MessageEvent<unknown>) => {
  const data = event.data;
  if (typeof data !== 'object' || data === null) {
    throw new Error('draw-blurhash: invalid data');
  }
  if (!('id' in data && typeof data.id === 'string')) {
    throw new Error('draw-blurhash: invalid id');
  }
  if (!('hash' in data && typeof data.hash === 'string')) {
    throw new Error('draw-blurhash: invalid hash');
  }
  const { id, hash } = data;
  const canvas = new OffscreenCanvas(64, 64);
  render(hash, canvas);
  const bitmap = canvas.transferToImageBitmap();
  postMessage({ id, bitmap });
});
