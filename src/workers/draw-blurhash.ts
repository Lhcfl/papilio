/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { render } from 'buraha';

// biome-ignore lint/suspicious/noGlobalAssign: Worker context
onmessage = (event) => {
  if (typeof event.data !== 'object' || event.data === null) {
    throw new Error('draw-blurhash: invalid data');
  }
  const { id, hash } = event.data;
  if (!(typeof id === 'string')) {
    throw new Error('draw-blurhash: invalid id');
  }
  if (!(typeof hash === 'string')) {
    throw new Error('draw-blurhash: invalid hash');
  }
  const canvas = new OffscreenCanvas(64, 64);
  render(hash, canvas);
  const bitmap = canvas.transferToImageBitmap();
  postMessage({ id, bitmap });
};
