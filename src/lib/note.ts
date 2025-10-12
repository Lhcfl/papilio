import type { MfmNode } from 'mfm-js';
import type { NoteWithExtension } from '@/types/note';
import { getRelativeUrl } from '@/services/inject-misskey-api';

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

export function getNoteRoute(id: string) {
  return `/notes/${id}`;
}

export function getNoteRemoteUrl(note: NoteWithExtension) {
  return note.url || getRelativeUrl(`/notes/${note.id}`);
}
