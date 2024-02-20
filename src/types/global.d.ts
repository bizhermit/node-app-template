type Struct<T = any> = { [v: string]: T };

type VoidFunc = () => void;

type Nullable<T> = T | null | undefined;

type DeepReadonly<T> =
  T extends (Function | Date | Error | RegExp) ? T :
  { readonly [key in keyof T]: DeepReadonly<T[key]> };

type ExUrl = `http:${string}` | `https:${string}`;
