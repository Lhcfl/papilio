import type { NoteWithExtension } from '@/types/note'

export function isPureRenote(n: NoteWithExtension): n is NoteWithExtension & { renoteId: string } {
  return Boolean(n.renoteId && !n.text && !n.cw && !n.poll && !n.fileIds?.length)
}
