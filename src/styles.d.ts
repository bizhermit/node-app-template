type SystemColor = "base"
  | "pure"
  | "dull"
  | "border"
  | "shadow"
  | "mask"
  | "input"
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

type CustomColor = | "primary"
  | "secondary"
  | "tertiary"
  | "warning"
  | "danger"
  | "cool"
  | "pretty"
  ;

type Color = SystemColor | CustomColor;

type Size = "xs"
  | "s"
  | "m"
  | "l"
  | "xl"
  ;