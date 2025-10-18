/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { injectMisskeyApi } from '@/services/inject-misskey-api';
import { useMutation, type MutationFunctionContext } from '@tanstack/react-query';
import type { UserDetailed } from 'misskey-js/entities.js';

const patch = (v: Partial<UserDetailed>) => (old: UserDetailed | undefined) => (old ? { ...old, ...v } : old);

interface CommonProps {
  id: string;
  username: string;
  host: string | null;
}

const cs =
  (props: CommonProps, v: Partial<UserDetailed>) =>
  (_0: unknown, _1: unknown, _2: unknown, context: MutationFunctionContext) => {
    context.client.setQueryData(['user', props.id], patch(v));
    context.client.setQueryData(['user', props.username, props.host], patch(v));
    void context.client.invalidateQueries({ queryKey: ['user', props.id] });
    void context.client.invalidateQueries({ queryKey: ['user', props.username, props.host] });
  };

export const useRejectFollowRequestAction = (props: CommonProps) => {
  const api = injectMisskeyApi();
  return useMutation({
    mutationKey: ['rejectFollowRequest', props.id],
    mutationFn: () => api.request('following/requests/reject', { userId: props.id }),
    onSuccess: cs(props, { hasPendingFollowRequestToYou: false }),
  });
};

export const useAcceptFollowRequestAction = (props: CommonProps) => {
  const api = injectMisskeyApi();
  return useMutation({
    mutationKey: ['acceptFollowRequest', props.id],
    mutationFn: () => api.request('following/requests/accept', { userId: props.id }),
    onSuccess: cs(props, { hasPendingFollowRequestToYou: false, isFollowed: true }),
  });
};

export const useCancelFollowRequestAction = (props: CommonProps) => {
  const api = injectMisskeyApi();
  return useMutation({
    mutationKey: ['cancelFollowRequest', props.id],
    mutationFn: () => api.request('following/requests/cancel', { userId: props.id }),
    onSuccess: cs(props, { hasPendingFollowRequestFromYou: false }),
  });
};

export const useFollowAction = (props: CommonProps) => {
  const api = injectMisskeyApi();
  return useMutation({
    mutationKey: ['follow', props.id],
    mutationFn: () => api.request('following/create', { userId: props.id }),
    onSuccess: cs(props, { hasPendingFollowRequestFromYou: true }),
  });
};

export const useUnfollowAction = (props: CommonProps) => {
  const api = injectMisskeyApi();
  return useMutation({
    mutationKey: ['unfollow', props.id],
    mutationFn: () => api.request('following/delete', { userId: props.id }),
    onSuccess: cs(props, { isFollowing: false }),
  });
};

export const useBlockAction = (props: CommonProps) => {
  const api = injectMisskeyApi();
  return useMutation({
    mutationKey: ['block', props.id],
    mutationFn: () => api.request('blocking/create', { userId: props.id }),
    onSuccess: cs(props, { isBlocking: true }),
  });
};

export const useUnblockAction = (props: CommonProps) => {
  const api = injectMisskeyApi();
  return useMutation({
    mutationKey: ['unblock', props.id],
    mutationFn: () => api.request('blocking/delete', { userId: props.id }),
    onSuccess: cs(props, { isBlocking: false }),
  });
};

export const useMuteAction = (props: CommonProps) => {
  const api = injectMisskeyApi();
  return useMutation({
    mutationKey: ['mute', props.id],
    mutationFn: (expiresAt: number | null) => api.request('mute/create', { userId: props.id, expiresAt }),
    onSuccess: cs(props, { isMuted: true }),
  });
};

export const useUnmuteAction = (props: CommonProps) => {
  const api = injectMisskeyApi();
  return useMutation({
    mutationKey: ['unmute', props.id],
    mutationFn: () => api.request('mute/delete', { userId: props.id }),
    onSuccess: cs(props, { isMuted: false }),
  });
};
