import type { Note, Notification } from 'misskey-js/entities.js';
import type { Notification as SharkeyNotification } from 'sharkey-js/entities.js';

export type FrontendGroupedNotification =
  | Notification
  | {
      type: 'grouped:reaction';
      id: string;
      note: Note;
      createdAt: string;
      grouped: Extract<Notification, { type: 'reaction' }>[];
    }
  | {
      type: 'grouped:renote';
      id: string;
      note: Note;
      createdAt: string;
      grouped: Extract<Notification, { type: 'renote' }>[];
    }
  | Extract<SharkeyNotification, { type: 'edited' }>;

// "notification-grouped" API is buggy, so we implement grouping here.
export function groupNotifications(ns: Notification[]) {
  const res: FrontendGroupedNotification[] = [];
  const groupping = new Map<string, Notification[]>();

  function pushInto(n: Notification, grouppingKey: string) {
    const arr = groupping.get(grouppingKey);
    if (arr == null) {
      groupping.set(grouppingKey, [n]);
    } else {
      arr.push(n);
    }
  }

  for (const n of ns) {
    switch (n.type) {
      case 'renote': {
        pushInto(n, `${n.type}:${n.note.renote?.id ?? n.note.id}`);
        break;
      }
      case 'reaction': {
        pushInto(n, `${n.type}:${n.note.id}`);
        break;
      }
      default: {
        pushInto(n, `unique:${n.id}`);
        break;
      }
    }
  }

  for (const [key, grouped] of groupping) {
    const [type, id] = key.split(':');
    switch (type) {
      case 'renote':
      case 'reaction': {
        if (grouped.length === 1) {
          res.push(grouped[0] as FrontendGroupedNotification);
        } else {
          const g = grouped as Extract<Notification, { type: 'renote' }>[];
          res.push({
            type: `grouped:${type}` as 'grouped:renote',
            id: `${type}:${id}`,
            note: g[0].note,
            createdAt: g[0].createdAt,
            grouped: g,
          });
        }
        break;
      }
      case 'unique': {
        res.push(grouped[0] as FrontendGroupedNotification);
        break;
      }
      default: {
        throw new Error(`unreachable: ${type}`);
      }
    }
  }

  return res;
}
