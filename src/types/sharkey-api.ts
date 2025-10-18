/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

//  This is a type definition file for Sharkey API, which is a fork of Misskey API.
import type { Endpoints as MisskeyEndPoints } from 'misskey-js';
import type { Endpoints as SharkeyEndPoints } from '@@/sharkey-js/index';

export type Endpoints = MisskeyEndPoints & Omit<SharkeyEndPoints, keyof MisskeyEndPoints>;

interface SwitchCase<Condition = unknown, Result = unknown> {
  $switch: {
    $cases: [Condition, Result][];
    $default: Result;
  };
}

type IsNeverType<T> = [T] extends [never] ? true : false;
type StrictExtract<Union, Cond> = Cond extends Union ? Union : never;

type IsCaseMatched<
  E extends keyof Endpoints,
  P extends Endpoints[E]['req'],
  C extends number,
> = Endpoints[E]['res'] extends SwitchCase
  ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
    IsNeverType<StrictExtract<Endpoints[E]['res']['$switch']['$cases'][C], [P, any]>> extends false
    ? true
    : false
  : false;

type GetCaseResult<
  E extends keyof Endpoints,
  P extends Endpoints[E]['req'],
  C extends number,
> = Endpoints[E]['res'] extends SwitchCase
  ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
    StrictExtract<Endpoints[E]['res']['$switch']['$cases'][C], [P, any]>[1]
  : never;

export type SwitchCaseResponseType<
  E extends keyof Endpoints,
  P extends Endpoints[E]['req'],
> = Endpoints[E]['res'] extends SwitchCase
  ? IsCaseMatched<E, P, 0> extends true
    ? GetCaseResult<E, P, 0>
    : IsCaseMatched<E, P, 1> extends true
      ? GetCaseResult<E, P, 1>
      : IsCaseMatched<E, P, 2> extends true
        ? GetCaseResult<E, P, 2>
        : IsCaseMatched<E, P, 3> extends true
          ? GetCaseResult<E, P, 3>
          : IsCaseMatched<E, P, 4> extends true
            ? GetCaseResult<E, P, 4>
            : IsCaseMatched<E, P, 5> extends true
              ? GetCaseResult<E, P, 5>
              : IsCaseMatched<E, P, 6> extends true
                ? GetCaseResult<E, P, 6>
                : IsCaseMatched<E, P, 7> extends true
                  ? GetCaseResult<E, P, 7>
                  : IsCaseMatched<E, P, 8> extends true
                    ? GetCaseResult<E, P, 8>
                    : IsCaseMatched<E, P, 9> extends true
                      ? GetCaseResult<E, P, 9>
                      : Endpoints[E]['res']['$switch']['$default']
  : Endpoints[E]['res'];
