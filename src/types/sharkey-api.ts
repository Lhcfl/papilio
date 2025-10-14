//  This is a type definition file for Sharkey API, which is a fork of Misskey API.
import type { Endpoints as MisskeyEndPoints } from 'misskey-js';
import type { Endpoints as SharkeyEndPoints } from '@@/sharkey-js/index';

export type Endpoints = MisskeyEndPoints & SharkeyEndPoints;
