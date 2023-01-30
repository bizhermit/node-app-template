import useLayout, { WindowSize } from "@/components/providers/layout";
import React, { createContext, HTMLAttributes, ReactNode, useCallback, useContext, useEffect, useRef, useState } from "react";
import Style from "$/components/elements/navigation-container.module.scss";
import { VscChromeClose, VscMenu } from "react-icons/vsc";
import { attributesWithoutChildren } from "@/components/utilities/attributes";
import useToggleAnimation from "@/hooks/toggle-animation";

export type NavigationPosition = "left" | "right" | "top" | "bottom";

export type NavigationMode = "auto" | "visible" | "minimize" | "manual" | "none";

export type HeaderVisible = "always" | "none";
export type FooterVisible = "always" | "end" | "none";

type NavigationContextProps = {
  toggle: (open?: boolean) => void;
  showedNavigation: boolean;
  navigationPosition: NavigationPosition;
  navigationMode: NavigationMode;
  setNavigationMode: (mode: NavigationMode) => void;
  navigationState: Omit<NavigationMode, "auto">;
  headerVisible: HeaderVisible;
  setHeaderVisible: (mode: HeaderVisible) => void;
  footerVisible: FooterVisible;
  setFooterVisible: (mode: FooterVisible) => void;
}

const NavigationContext = createContext<NavigationContextProps>({
  toggle: () => { },
  showedNavigation: false,
  navigationPosition: "left",
  navigationMode: "none",
  setNavigationMode: () => { },
  navigationState: "none",
  headerVisible: "none",
  setHeaderVisible: () => { },
  footerVisible: "none",
  setFooterVisible: () => { },
});

export const useNavigation = () => {
  return useContext(NavigationContext);
};

type OmitAttributes = "color" | "children";
export type NavigationContainerProps = Omit<HTMLAttributes<HTMLDivElement>, OmitAttributes> & {
  $navigationPosition?: NavigationPosition;
  $navigationMode?: NavigationMode;
  $headerVisible?: "always" | "none";
  $footerVisible?: "always" | "end" | "none";
  $headerTag?: React.ElementType;
  $footerTag?: React.ElementType;
  $navTag?: React.ElementType;
  $mainTag?: React.ElementType;
  children: [ReactNode, ReactNode] | [ReactNode, ReactNode, ReactNode] | [ReactNode, ReactNode, ReactNode, ReactNode];
};

const NavigationContainer = React.forwardRef<HTMLDivElement, NavigationContainerProps>((props, ref) => {
  const layout = useLayout();
  const navRef = useRef<HTMLElement>(null!);
  const maskRef = useRef<HTMLDivElement>(null!);
  const [showedNav, setShowedNav] = useState(false);
  const [navigationMode, setNavigationMode] = useState<NavigationMode>(props.$navigationMode || "auto");
  const [navMode, setNavMode] = useState<Omit<NavigationMode, "auto">>(() => {
    if (navigationMode === "auto") return "visible";
    return navigationMode;
  });
  const [headerVisible, setHeaderVisible] = useState(props.$headerVisible || "always");
  const [footerVisible, setFooterVisible] = useState(props.$footerVisible || "end");

  const HeaderTag = props.$headerTag ?? "header";
  const FooterTag = props.$footerTag ?? "footer";
  const NavTag = props.$navTag ?? "nav";
  const MainTag = props.$mainTag ?? "main";
  const navPosition = props.$navigationPosition ?? "left";
  const childCtx = (() => {
    const hasHeader = props.children.length >= 3;
    const hasFooter = props.children.length >= 4;
    return {
      header: hasHeader ? 0 : undefined,
      nav: hasHeader ? 1 : 0,
      main: hasHeader ? 2 : 1,
      footer: hasFooter ? 3 : undefined,
    };
  })();

  const click = (e: React.MouseEvent) => {
    if (navPosition === "top" || navPosition === "bottom") {
      const elem = e.target as HTMLElement;
      const tagName = elem.tagName;
      if (tagName === "UL") toggleNav(false);
    }
  };

  const mouseEnter = () => {
    if (navMode !== "minimize") return;
    setShowedNav(true);
  };

  const mouseLeave = () => {
    if (navMode !== "minimize") return;
    setShowedNav(false);
  };

  const toggleNav = useCallback((open?: boolean) => {
    if (open == null) {
      setShowedNav(c => !c);
      return;
    }
    setShowedNav(open);
  }, []);

  const toggleAnimationInitStyle = useToggleAnimation({
    elementRef: navRef,
    open: navMode === "visible" || showedNav,
    direction: (navPosition === "top" || navPosition === "bottom") ? "vertical" : "horizontal",
    minVisible: navMode === "minimize",
    min: navMode === "manual" ? undefined :
      typeof document === "undefined" ? "3.6rem" :
        getComputedStyle(document.documentElement).getPropertyValue("--nav-size") || "0",
    onToggle: () => {
      if (maskRef.current) {
        maskRef.current.style.removeProperty("display");
      }
      if (navPosition === "left" || navPosition === "right") navRef.current.scrollLeft = 0;
      else navRef.current.scrollTop = 0;
    },
    onToggling: (context) => {
      if (maskRef.current) {
        maskRef.current.style.opacity = String(context.opacity);
      }
    },
    onToggled: (open) => {
      if (maskRef.current) {
        if (open) {
          maskRef.current.style.removeProperty("display");
        } else {
          maskRef.current.style.display = "none";
        }
      }
    },
  }, [navMode]);

  const toggleModeBySize = () => {
    if (navPosition === "top" || navPosition === "bottom") return;
    if (layout.mobile) {
      setNavMode("manual");
      setShowedNav(false);
      return;
    }
    if (layout.windowSize > WindowSize.m) {
      setNavMode("visible");
      return;
    }
    if (layout.windowSize > WindowSize.s) {
      setNavMode("minimize");
      setShowedNav(false);
      return;
    }
    setNavMode("manual");
    setShowedNav(false);
  };

  useEffect(() => {
    if (navigationMode !== "auto") return;
    toggleModeBySize();
  }, [layout.windowSize, headerVisible]);

  return (
    <NavigationContext.Provider
      value={{
        toggle: toggleNav,
        showedNavigation: showedNav,
        navigationMode,
        navigationPosition: navPosition,
        navigationState: navMode,
        setNavigationMode: (mode = "auto") => {
          setNavigationMode(mode);
          if (mode === "auto") {
            toggleModeBySize();
            return;
          }
          setNavMode(mode);
        },
        headerVisible,
        setHeaderVisible: (mode = "always") => {
          setHeaderVisible(mode);
        },
        footerVisible,
        setFooterVisible: (mode = "end") => {
          setFooterVisible(mode);
        },
      }}
    >
      <div
        {...attributesWithoutChildren(props, Style.wrap)}
        ref={ref}
      >
        {headerVisible !== "none" && childCtx.header != null &&
          <HeaderTag
            className={Style.header}
            data-pos={navPosition}
          >
            {navMode === "manual" ?
              <>
                <div
                  className={Style.button}
                  onClick={() => toggleNav()}
                >
                  {showedNav ? <VscChromeClose /> : <VscMenu />}
                </div>
                <div
                  className={Style.contents}
                >
                  {props.children[childCtx.header]}
                </div>
              </> :
              props.children[childCtx.header]
            }
          </HeaderTag>
        }
        <div
          className={Style.body}
          data-mode={navMode}
          data-pos={navPosition}
        >
          {navMode !== "none" &&
            <NavTag
              ref={navRef}
              className={Style.nav}
              style={toggleAnimationInitStyle}
              data-mode={navMode}
              data-pos={navPosition}
              data-show={showedNav}
              onClick={click}
              onMouseEnter={mouseEnter}
              onMouseLeave={mouseLeave}
            >
              {props.children[childCtx.nav]}
            </NavTag>
          }
          {navMode === "manual" &&
            <div
              ref={maskRef}
              className={Style.mask}
              onClick={() => toggleNav(false)}
            />
          }
          <div className={Style.content}>
            <MainTag
              className={Style.main}
              data-footer={footerVisible}
            >
              {props.children[childCtx.main]}
            </MainTag>
            {footerVisible !== "none" && childCtx.footer != null &&
              <FooterTag className={Style.footer}>
                {props.children[childCtx.footer]}
              </FooterTag>
            }
          </div>
        </div>
      </div>
    </NavigationContext.Provider>
  );
});

export default NavigationContainer;