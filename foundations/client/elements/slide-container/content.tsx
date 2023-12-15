import type { FC, HTMLAttributes, Key, ReactNode } from "react";

type SlideCotentOptions = {
  key: Key;
  $label?: ReactNode;
  $overlap?: boolean;
  $defaultMount?: boolean;
  $unmountDeselected?: boolean;
};

export type SlideContentProps = OverwriteAttrs<HTMLAttributes<HTMLDivElement>, SlideCotentOptions>;

const SlideContent: FC<SlideContentProps> = ({ children }) => {
  return <>{children}</>;
};

export default SlideContent;