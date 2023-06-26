"use client";

import { WindowSize, type WindowSizeValue } from "#/components/providers/layout/consts";
import { LayoutContext } from "#/components/providers/layout/context";
import { type FC, type ReactNode, useCallback, useEffect, useState } from "react";

const LayoutProvider: FC<{
  initWindowSize?: WindowSizeValue;
  children?: ReactNode;
}> = ({ initWindowSize, children }) => {
  const [windowSize, setWindowSize] = useState<WindowSizeValue>(initWindowSize ?? WindowSize.m);

  const resizeWindow = useCallback(() => {
    const cw = document.body.clientWidth;
    if (cw > 1200) {
      setWindowSize(WindowSize.xl);
      return;
    }
    if (cw > 800) {
      setWindowSize(WindowSize.l);
      return;
    }
    if (cw > 600) {
      setWindowSize(WindowSize.m);
      return;
    }
    if (cw > 480) {
      setWindowSize(WindowSize.s);
      return;
    }
    setWindowSize(WindowSize.xs);
  }, []);

  useEffect(() => {
    window.addEventListener("resize", resizeWindow);
    resizeWindow();
    return () => {
      window.removeEventListener("resize", resizeWindow);
    };
  }, []);

  return (
    <LayoutContext.Provider
      value={{
        windowSize,
        mobile: windowSize < WindowSize.m,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};

export default LayoutProvider;