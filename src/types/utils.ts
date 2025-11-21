// type test = OptionalKeys<{ a: number; b?: string; c: string | undefined }>;
// then type test = 'b' | 'c'
type OptionalKeys<T> = {
  [K in keyof T]-?: undefined extends T[K] ? K : never;
}[keyof T];

type MergeArrays<T extends unknown[], U extends unknown[]> = Merge<T[number], U[number]>[];

export type Merge<T, U> = T extends unknown[]
  ? U extends unknown[]
    ? MergeArrays<T, U>
    : U | T
  : T extends object
    ? U extends object
      ? {
          // Properties only in T, will be optional
          [K in keyof Omit<T, keyof U>]?: T[K];
        } & {
          // Properties only in U, will be optional
          [K in keyof Omit<U, keyof T>]?: U[K];
        } & {
          // Properties in both T and U, but optional in either T or U, will be optional
          [K in Extract<keyof T & keyof U, OptionalKeys<T> | OptionalKeys<U>>]?: Merge<T[K], U[K]>;
        } & {
          // Properties in both T and U, required in both, will be required
          [K in Exclude<keyof T & keyof U, OptionalKeys<T> | OptionalKeys<U>>]: Merge<T[K], U[K]>;
        }
      : U | T
    : U | T;
