import { Suspense, useMemo, useRef, type FC, type ReactNode } from "react";
import { windowOpen } from "../../utilities/window-open";
import { WindowContext } from "./context";
import WindowProviderEventListener from "./listener";

export const WindowProvider: FC<{
  children?: ReactNode;
}> = ({ children }) => {
  const wins = useRef<Array<ReturnType<typeof windowOpen>>>([]);

  const append = (ctx: ReturnType<typeof windowOpen>) => {
    wins.current.push(ctx);
  };

  return (
    <WindowContext.Provider
      value={
        useMemo(() => {
          return { append };
        }, [])
      }
    >
      <Suspense>
        <WindowProviderEventListener wins={wins} />
      </Suspense>
      {children}
    </WindowContext.Provider>
  );
};

export default WindowProvider;