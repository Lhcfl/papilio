import { acct } from 'misskey-js';

export const getUserRoute = (u: { username: string; host: string | null }) => `/@${acct.toString(u)}`;
