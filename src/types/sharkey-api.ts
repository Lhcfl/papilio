//  This is a type definition file for Sharkey API, which is a fork of Misskey API.
import type { Endpoints as MisskeyEndPoints } from 'misskey-js';

// TODO
type SharkeyEndPoints = unknown;

export type Endpoints = MisskeyEndPoints & SharkeyEndPoints;
