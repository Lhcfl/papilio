/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { MfmNode } from 'mfm-js';
import type { NoteWithExtension } from '@/types/note';
import { getRelativeUrl } from '@/lib/inject-misskey-api';

export function isPureRenote(n: NoteWithExtension): n is NoteWithExtension & { renoteId: string } {
  return Boolean(n.renoteId && !n.text && !n.cw && !n.poll && !n.fileIds?.length);
}

export function someAst(ast: MfmNode[], pred: (node: MfmNode) => boolean): boolean {
  return ast.some((node) => {
    if (pred(node)) return true;
    if (node.children) {
      return someAst(node.children, pred);
    }
    return false;
  });
}

export function countAst(ast: MfmNode[], pred: (note: MfmNode) => number | boolean): number {
  return ast.reduce((acc, node) => acc + Number(pred(node)) + (node.children ? countAst(node.children, pred) : 0), 0);
}

export function collectAst<T>(ast: MfmNode[], pred: (node: MfmNode) => T | undefined): T[] {
  return ast.flatMap((node) => {
    const result = [];
    const t = pred(node);
    if (t) result.push(t);
    if (node.children) result.push(...collectAst(node.children, pred));
    return result;
  });
}

export function getNoteRemoteUrl(note: NoteWithExtension) {
  return note.url ?? getRelativeUrl(`/notes/${note.id}`);
}

export const VISIBILITIES = ['public', 'home', 'followers', 'specified'] as const;

export function downgradeVisibility(
  limit: (typeof VISIBILITIES)[number],
  x: (typeof VISIBILITIES)[number],
): (typeof VISIBILITIES)[number] {
  const order = VISIBILITIES.indexOf(limit);
  const targetOrder = VISIBILITIES.indexOf(x);
  return VISIBILITIES[Math.max(order, targetOrder)];
}
