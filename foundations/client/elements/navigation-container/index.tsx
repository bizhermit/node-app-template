"use client";

import { forwardRef, useRef, useState, type ElementType, type HTMLAttributes, type ReactNode } from "react";
import { attributesWithoutChildren } from "../../utilities/attributes";
import { CrossIcon, MenuIcon, MenuLeftIcon, MenuRightIcon } from "../icon";
import { NavigationContext, type NavigationMode, type NavigationPosition } from "../navigation-container/context";
import Style from "./index.module.scss";

type OmitAttributes = "color" | "children";
export type NavigationContainerProps = Omit<HTMLAttributes<HTMLDivElement>, OmitAttributes> & {
  $defaultNavPosition?: NavigationPosition;
  $navPosition?: NavigationPosition;
  $defaultNavMode?: NavigationMode;
  $navMode?: NavigationMode;
  $headerTag?: ElementType;
  $footerTag?: ElementType;
  $navTag?: ElementType;
  $mainTag?: ElementType;
  $header?: ReactNode;
  $footer?: ReactNode;
  $nav?: ReactNode;
  children: ReactNode;
};

const NavigationContainer = forwardRef<HTMLDivElement, NavigationContainerProps>((props, ref) => {
  const cornerRef = useRef<HTMLDivElement>(null!);
  const [navPos, setNavPos] = useState(props.$defaultNavPosition);
  const [navMode, setNavMode] = useState(props.$defaultNavMode);

  const HeaderTag = props.$headerTag ?? "header";
  const FooterTag = props.$footerTag ?? "footer";
  const NavTag = props.$navTag ?? "nav";
  const MainTag = props.$mainTag ?? "main";

  const pos = props.$navPosition ?? navPos ?? "left";
  const mode = props.$navMode ?? navMode ?? "auto";

  return (
    <NavigationContext.Provider
      value={{
        navPos: pos,
        setNavPos,
        navMode: mode,
        setNavMode,
        toggle: () => {

        },
      }}
    >
      <input
        className={Style.max}
        id="nav-menu"
        type="checkbox"
      />
      <input
        className={Style.min}
        id="nav-min"
        type="checkbox"
      />
      <div
        {...attributesWithoutChildren(props, Style.wrap)}
        ref={ref}
        data-pos={pos}
        data-mode={mode}
      >
        <label
          className={Style.mask}
          htmlFor="nav-menu"
        />
        {props.$nav &&
          <NavTag
            className={Style.nav}
            data-pos={pos}
            data-mode={mode}
          >
            {props.$nav}
          </NavTag>
        }
        <div
          className={Style.body}
          data-pos={pos}
        >
          <HeaderTag
            className={Style.header}
            data-pos={pos}
          >
            {(mode === "auto" || mode === "manual") &&
              <div
                className={Style.corner}
                ref={cornerRef}
              >
                <label
                  className={Style.tomax}
                  htmlFor="nav-menu"
                >
                  <MenuIcon className={Style.menuOpen} />
                  <CrossIcon className={Style.menuHide} />
                  <MenuLeftIcon
                    className={pos === "left" ? Style.slideClose : Style.slideOpen}
                  />
                  <MenuRightIcon
                    className={pos === "left" ? Style.slideOpen : Style.slideClose}
                  />
                </label>
                {mode === "auto" &&
                  <label
                    className={Style.tomin}
                    htmlFor="nav-min"
                  >
                    <MenuLeftIcon
                      className={pos === "left" ? Style.slideMax : Style.slideMin}
                    />
                    <MenuRightIcon
                      className={pos === "left" ? Style.slideMin : Style.slideMax}
                    />
                  </label>
                }
              </div>
            }
            <div className={Style.hcontent}>
              {props.$header}
            </div>
          </HeaderTag>
          <MainTag
            className={Style.main}
            data-pos={pos}
          >
            {props.children}
          </MainTag>
          {props.$footer &&
            <FooterTag className={Style.footer}>
              {props.$footer}
            </FooterTag>
          }
        </div>
      </div>
    </NavigationContext.Provider>
  );
});

export default NavigationContainer;