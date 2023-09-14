import type { FC, ReactNode } from "react";

const SlideContent: FC<{
  label?: ReactNode;
  overlap?: boolean;
  defaultMount?: boolean;
  preventUnmountDeselected?: boolean;
  preventAnimation?: boolean;
  children?: ReactNode;
}> = ({ children }) => {
  return <>{children}</>;
};

export default SlideContent;