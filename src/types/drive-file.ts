import type { NoteWithExtension } from '@/types/note';

export type DriveFile = NonNullable<NoteWithExtension['files']>[number];
