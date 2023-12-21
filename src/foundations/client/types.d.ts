type ComponentAttrsWithRef<T, P = {}> = P & { ref?: React.MutableRefObject<T | null | undefined> };
type OverwriteAttrs<T extends HTMLAttributes<any>, U> = Omit<T, keyof U> & U;

type SystemColor =
  | "base"
  | "pure"
  | "dull"
  | "border"
  | "shadow"
  | "mask"
  | "input"
  | "placeholder"
  | "error"
  | "selected"
  | "hover"
  | "scroll"
  | "nav"
  | "sunday"
  | "saturday"
  | "main"
  | "main-light"
  | "main-dark"
  | "sub"
  | "sub-light"
  | "sub-dark"
  ;

type CustomColor =
  | "primary"
  | "secondary"
  | "tertiary"
  | "warning"
  | "danger"
  | "cool"
  | "pretty"
  ;

type Color = SystemColor | CustomColor;

type Size =
  | "xs"
  | "s"
  | "m"
  | "l"
  | "xl"
  ;