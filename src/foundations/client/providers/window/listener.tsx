"use client";

import { useParams, usePathname } from "next/navigation";
import { useEffect, type FC, type MutableRefObject } from "react";
import type { windowOpen } from "../../utilities/window-open";

const WindowProviderEventListener: FC<{
  wins: MutableRefObject<Array<ReturnType<typeof windowOpen>>>;
}> = ({ wins }) => {
  const pathname = usePathname();
  const params = useParams();

  useEffect(() => {
    wins.current.forEach(win => win.close());
    wins.current = wins.current.filter(win => win.showed());
  }, [pathname, JSON.stringify(params)]);

  return <></>;
};

export default WindowProviderEventListener;