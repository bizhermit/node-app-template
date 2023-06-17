import { type ElementType, forwardRef, type HTMLAttributes, type ReactNode, useCallback, useEffect, useRef, useState } from "react";
import Style from "#/styles/components/elements/navigation-container.module.scss";
import { attributesWithoutChildren } from "#/components/utilities/attributes";
import useToggleAnimation from "#/hooks/toggle-animation";
import { CrossIcon, MenuIcon } from "#/components/elements/icon";
import { NavigationContext, type NavigationFooterVisible, type NavigationHeaderVisible, type NavigationMode, type NavigationPosition } from "#/components/elements/navigation-container/context";
import useLayout, { WindowSize } from "#/components/providers/layout/context";

const defaultKey = "default";

type OmitAttributes = "color" | "children";
export type NavigationContainerProps = Omit<HTMLAttributes<HTMLDivElement>, OmitAttributes> & {
  $defaultNavigationPosition?: NavigationPosition;
  $defaultNavigationMode?: NavigationMode;
  $defaultHeaderVisible?: NavigationHeaderVisible;
  $defaultFooterVisible?: NavigationFooterVisible;
  $headerTag?: ElementType;
  $footerTag?: ElementType;
  $navTag?: ElementType;
  $mainTag?: ElementType;
  children: [ReactNode, ReactNode] | [ReactNode, ReactNode, ReactNode] | [ReactNode, ReactNode, ReactNode, ReactNode];
};

const defaultNavigationPosition: NavigationPosition = "left";
const defaultNavigationMode: NavigationMode = "auto";
const defaultHeaderVisible: NavigationHeaderVisible = "always";
const defaultFooterVisible: NavigationFooterVisible = "end";

const NavigationContainer = forwardRef<HTMLDivElement, NavigationContainerProps>((props, ref) => {
  const layout = useLayout();
  const navRef = useRef<HTMLElement>(null!);
  const maskRef = useRef<HTMLDivElement>(null!);
  const [showedNav, setShowedNav] = useState(false);
  const [navigationMode, setNavigationMode] = useState<NavigationMode>(props.$defaultNavigationMode || defaultNavigationMode);
  const [navMode, setNavMode] = useState<Omit<NavigationMode, "auto">>(() => {
    if (navigationMode === "auto") return "visible";
    return navigationMode;
  });
  const [headerVisible, setHeaderVisible] = useState(props.$defaultHeaderVisible || defaultHeaderVisible);
  const [footerVisible, setFooterVisible] = useState(props.$defaultFooterVisible || defaultFooterVisible);

  const HeaderTag = props.$headerTag ?? "header";
  const FooterTag = props.$footerTag ?? "footer";
  const NavTag = props.$navTag ?? "nav";
  const MainTag = props.$mainTag ?? "main";
  const [navPosition, setNavigationPosition] = useState(props.$defaultNavigationPosition ?? defaultNavigationPosition);
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
  }, [navMode, navPosition]);

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
        showed: showedNav,
        position: navPosition,
        setPosition: (pos = defaultNavigationPosition) => {
          setNavigationPosition(pos === defaultKey ? (props.$defaultNavigationPosition || defaultNavigationPosition) : pos);
        },
        state: navMode,
        mode: navigationMode,
        setMode: (mode = defaultNavigationMode) => {
          const m = mode === defaultKey ? (props.$defaultNavigationMode || defaultNavigationMode) : mode;
          setNavigationMode(m);
          if (m === "auto") {
            toggleModeBySize();
            return;
          }
          setNavMode(m);
        },
        headerVisible,
        setHeaderVisible: (mode = defaultHeaderVisible) => {
          setHeaderVisible(mode === defaultKey ? (props.$defaultHeaderVisible || defaultHeaderVisible) : mode);
        },
        footerVisible,
        setFooterVisible: (mode = defaultFooterVisible) => {
          setFooterVisible(mode === defaultKey ? (props.$defaultFooterVisible || defaultFooterVisible) : mode);
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
                  {showedNav ? <CrossIcon /> : <MenuIcon />}
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
          {navMode === "manual" &&
            <div
              ref={maskRef}
              className={Style.mask}
              onClick={() => toggleNav(false)}
            />
          }
        </div>
      </div>
    </NavigationContext.Provider>
  );
});

export default NavigationContainer;