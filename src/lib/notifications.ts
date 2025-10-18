/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

export const NOTIFICATION_TYPES = [
  'note',
  'follow',
  'mention',
  'reply',
  'renote',
  'quote',
  'reaction',
  'pollEnded',
  'scheduledNotePosted',
  // This is a new misskey notification type but not yet supported in sharkey
  // 'scheduledNotePostFailed',
  'receiveFollowRequest',
  'followRequestAccepted',
  'roleAssigned',
  'chatRoomInvitationReceived',
  'achievementEarned',
  'exportCompleted',
  'login',
  'createToken',
  'app',
  'test',
  'pollVote',
  'groupInvited',
] as const;

export type NotificationIncludeableType = (typeof NOTIFICATION_TYPES)[number];
