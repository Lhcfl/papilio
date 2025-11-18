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
      case 'renote': {
        if (grouped.length === 1) {
          res.push(grouped[0] as FrontendGroupedNotification);
        } else {
          res.push({
            type: 'grouped:renote',
            id,
            note: (grouped as Extract<Notification, { type: 'renote' }>[])[0].note,
            createdAt: (grouped as Extract<Notification, { type: 'renote' }>[])[0].createdAt,
            grouped: grouped as Extract<Notification, { type: 'renote' }>[],
          });
        }
        break;
      }
      case 'reaction': {
        if (grouped.length === 1) {
          res.push(grouped[0] as FrontendGroupedNotification);
        } else {
          res.push({
            type: 'grouped:reaction',
            id,
            note: (grouped as Extract<Notification, { type: 'reaction' }>[])[0].note,
            createdAt: (grouped as Extract<Notification, { type: 'reaction' }>[])[0].createdAt,
            grouped: grouped as Extract<Notification, { type: 'reaction' }>[],
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
