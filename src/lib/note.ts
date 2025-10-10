import type { MfmNode } from 'mfm-js'
import type { NoteWithExtension } from '@/types/note'

export function isPureRenote(n: NoteWithExtension): n is NoteWithExtension & { renoteId: string } {
  return Boolean(n.renoteId && !n.text && !n.cw && !n.poll && !n.fileIds?.length)
}

export function someAst(ast: MfmNode[], pred: (node: MfmNode) => boolean): boolean {
  return ast.some((node) => {
    if (pred(node)) return true
    if (node.children) {
      return someAst(node.children, pred)
    }
    return false
  })
}

export function countAst(ast: MfmNode[], pred: (note: MfmNode) => number | boolean): number {
  return ast.reduce((acc, node) => acc + Number(pred(node)) + (node.children ? countAst(node.children, pred) : 0), 0)
}
