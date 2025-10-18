import type { NotificationIncludeableType } from '@/lib/notifications';
import { atom } from 'jotai';

export const excludeTypes = atom<NotificationIncludeableType[]>([]);
