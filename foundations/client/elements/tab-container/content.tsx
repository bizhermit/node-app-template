import type { FC, HTMLAttributes, ReactNode } from "react";

type TabContentOptions = {
  key: string;
  $label: ReactNode;
  $color?: Color;
  $defaultMount?: boolean;
  $unmountDeselected?: boolean;
};

export type TabContentProps = OverwriteAttrs<HTMLAttributes<HTMLDivElement>, TabContentOptions>;

const TabContent: FC<TabContentProps> = ({ children }) => {
  return <>{children}</>;
};

export default TabContent;