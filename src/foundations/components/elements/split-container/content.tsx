import type { FC, ReactNode } from "react";

const SplitContent: FC<{
  defaultSize?: number | string;
  minSize?: number | string;
  maxSize?: number | string;
  children?: ReactNode;
}> = ({ children }) => {
  return <>{children}</>;
};

export default SplitContent;