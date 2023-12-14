import type { FC, HTMLAttributes, Key, ReactNode } from "react";

type TabContentOptions = {
  key: Key;
  $label: ReactNode;
  $color?: Color;
  $overlap?: boolean;
  $defaultMount?: boolean;
  $unmountDeselected?: boolean;
  $preventAnimation?: boolean;
};

export type TabContentProps = OverwriteAttrs<HTMLAttributes<HTMLDivElement>, TabContentOptions>;

const TabContent: FC<TabContentProps> = ({ children }) => {
  return <>{children}</>;
};

export default TabContent;