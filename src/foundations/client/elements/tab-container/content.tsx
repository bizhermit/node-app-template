import type { FC, Key, ReactNode } from "react";

const TabContent: FC<{
  key: Key;
  label: ReactNode;
  overlap?: boolean;
  defaultMount?: boolean;
  unmountDeselected?: boolean;
  preventAnimation?: boolean;
  children?: ReactNode;
}> = ({ children }) => {
  return <>{children}</>;
};

export default TabContent;