import { createContext, type FC, type ReactNode, useCallback, useContext, useEffect, useState } from "react";

export const WindowSize = {
  xs: 1,
  s: 2,
  m: 3,
  l: 4,
  xl: 5,
};
type WindowSizeValue = typeof WindowSize[keyof typeof WindowSize];

type LayoutContextProps = {
  windowSize: WindowSizeValue;
  mobile: boolean;
};

const LayoutContext = createContext<LayoutContextProps>({
  windowSize: WindowSize.m,
  mobile: false,
});

const useLayout = () => {
  return useContext(LayoutContext);
};

export const LayoutProvider: FC<{
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

export default useLayout;