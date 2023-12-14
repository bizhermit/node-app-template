"use client";

import { forwardRef, useReducer, useRef, useState } from "react";
import parseNum from "../../../objects/number/parse";
import { attrs, convertRemToPxNum } from "../../utilities/attributes";
import { CrossIcon, MenuIcon, MenuLeftIcon, MenuRightIcon } from "../icon";
import { NavigationContext, NavigationHeaderMode, NavigationMode, NavigationPosition, type NavigationContainerProps } from "../navigation-container/context";
import Style from "./nav-cont.module.scss";

const toggleVisId = "navTglVis";
const toggleMinId = "navTglMin";
const toggleMnuId = "navTglMnu";

const NavigationContainer = forwardRef<HTMLDivElement, NavigationContainerProps>(({
  $name,
  $navPosition,
  $defaultNavMode,
  $navMode,
  $headerMode,
  $headerTag,
  $footerTag,
  $navTag,
  $mainTag,
  $header,
  $footer,
  $nav,
  children,
  ...props
}, ref) => {
  const HeaderTag = $headerTag ?? "header";
  const FooterTag = $footerTag ?? "footer";
  const NavTag = $navTag ?? "nav";
  const MainTag = $mainTag ?? "main";
  const name = $name ?? "nav";

  const resetAuto = () => {
    const visElem = document.getElementById(`${name}_${toggleVisId}`) as HTMLInputElement;
    if (visElem) visElem.checked = false;
    const minElem = document.getElementById(`${name}_${toggleMinId}`) as HTMLInputElement;
    if (minElem) minElem.checked = false;
  };

  const cref = useRef<HTMLDivElement>(null!);
  const nref = useRef<HTMLDivElement>(null!);
  const mref = useRef<HTMLElement>(null!);
  const [navPos, setPosition] = useState<NavigationPosition>();
  const [navMode, setMode] = useReducer((state: NavigationMode, action: NavigationMode = "auto") => {
    if (state === action) return state;
    if (!action || action === "auto") resetAuto();
    return action;
  }, "auto");
  const [headerMode, setHeaderMode] = useState<NavigationHeaderMode>();

  const pos = $navPosition ?? navPos ?? "left";
  const mode = $navMode ?? navMode ?? "auto";
  const hmode = $headerMode ?? headerMode ?? "fill";

  const getHeaderSizeNum = () => {
    if (typeof window === "undefined" || mref.current == null) return 0;
    return convertRemToPxNum(
      parseNum(
        (getComputedStyle(mref.current).getPropertyValue("--header-size") || "0rem").replace("rem", "")
      )
    ) ?? 0;
  };

  return (
    <NavigationContext.Provider
      value={{
        position: pos,
        setPosition,
        mode,
        setMode,
        headerMode: hmode,
        setHeaderMode,
        toggle: () => {
          if (!cref.current || getComputedStyle(cref.current).display === "none") return;
          (cref.current.querySelector(":scope>label") as HTMLElement)?.click();
        },
        resetAuto,
        closeMenu: () => {
          const mnuElem = document.getElementById(`${name}_${toggleMnuId}`) as HTMLInputElement;
          if (mnuElem) mnuElem.checked = false;
        },
        getHeaderSizeNum,
        scrollIntoView: (elem, arg) => {
          if (elem == null) return;
          elem.scrollIntoView(arg);
          document.documentElement.scrollTop = document.documentElement.scrollTop - getHeaderSizeNum();
        },
        scrollNavIntoView: (elem, arg) => {
          elem?.scrollIntoView(arg);
        },
      }}
    >
      <input
        className={Style.tglVis}
        id={`${name}_${toggleVisId}`}
        name={name}
        type="radio"
        defaultChecked={$defaultNavMode === "visible"}
      />
      <input
        className={Style.tglMin}
        id={`${name}_${toggleMinId}`}
        name={name}
        type="radio"
        defaultChecked={$defaultNavMode === "minimize"}
      />
      <input
        className={Style.tglMnu}
        id={`${name}_${toggleMnuId}`}
        type="checkbox"
      />
      <div
        {...attrs(props, Style.wrap)}
        ref={ref}
        data-pos={pos}
        data-mode={mode}
        data-hmode={hmode}
      >
        <label
          className={Style.mask}
          htmlFor={`${name}_${toggleMnuId}`}
        />
        {$nav &&
          <NavTag className={Style.nav}>
            <div className={Style.nheader}>
              <label
                className={Style.btnVis}
                htmlFor={`${name}_${toggleVisId}`}
              />
              <label
                className={Style.btnMin}
                htmlFor={`${name}_${toggleMinId}`}
              />
              <div className={Style.corner}>
                <div className={Style.btn}>
                  <MenuLeftIcon className={Style.slideLeft} />
                  <MenuRightIcon className={Style.slideRight} />
                </div>
              </div>
            </div>
            <div
              ref={nref}
              className={Style.nmain}
            >
              {$nav}
            </div>
          </NavTag>
        }
        <div className={Style.body}>
          <HeaderTag className={Style.header}>
            <div
              ref={cref}
              className={Style.corner}
            >
              <label
                className={`${Style.btn} ${Style.btnMnu}`}
                htmlFor={`${name}_${toggleMnuId}`}
              >
                <MenuIcon className={Style.menuOpen} />
                <CrossIcon className={Style.menuHide} />
              </label>
            </div>
            <div className={Style.hcontent}>
              {$header}
            </div>
          </HeaderTag>
          <MainTag
            className={Style.main}
            ref={mref}
          >
            {children}
          </MainTag>
          {$footer &&
            <FooterTag className={Style.footer}>
              {$footer}
            </FooterTag>
          }
        </div>
      </div>
    </NavigationContext.Provider>
  );
});

export default NavigationContainer;