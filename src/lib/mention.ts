import type { NoteWithExtension } from '@/types/note';
import { acct } from 'misskey-js';
import { parse } from 'mfm-js';
import { collectAst } from './note';

export function extractMention(note: NoteWithExtension | undefined, me: { username: string; host: string | null }) {
  if (!note) return '';
  const mentions = [`@${acct.toString(note.user)}`];
  if (note.text) {
    const ast = parse(note.text);
    mentions.push(
      ...collectAst(ast, (node) => (node.type === 'mention' ? `@${acct.toString(node.props)}` : undefined)),
    );
  }
  const res = new Set(mentions);
  res.delete(`@${acct.toString(me)}`);
  res.delete(`@${me.username}`);
  return [...res, ''].join(' ');
}
