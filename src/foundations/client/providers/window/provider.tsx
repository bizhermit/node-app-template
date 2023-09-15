"use client";

import { useParams, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, type FC, type ReactNode } from "react";
import { windowOpen } from "../../utilities/window-open";
import { WindowContext } from "./context";

export const WindowProvider: FC<{
  children?: ReactNode;
}> = ({ children }) => {
  const pathname = usePathname();
  const params = useParams();
  const searchParams = useSearchParams();
  const wins = useRef<Array<ReturnType<typeof windowOpen>>>([]);

  const append = (ctx: ReturnType<typeof windowOpen>) => {
    wins.current.push(ctx);
  };

  useEffect(() => {
    wins.current.forEach(win => win.close());
    wins.current = wins.current.filter(win => win.showed());
  }, [pathname, JSON.stringify(params), searchParams?.toString()]);

  return (
    <WindowContext.Provider
      value={
        useMemo(() => {
          return { append };
        }, [])
      }
    >
      {children}
    </WindowContext.Provider>
  );
};

export default WindowProvider;