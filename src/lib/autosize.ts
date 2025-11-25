/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

export async function importAndAutosize(el: HTMLTextAreaElement) {
  if (!(typeof CSS !== 'undefined' && CSS.supports('field-sizing: content'))) {
    const { default: autosize } = await import('autosize');
    autosize(el);
  }
}
