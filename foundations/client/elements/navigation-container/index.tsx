"use client";

import { forwardRef, useEffect, useRef, useState, type ElementType, type HTMLAttributes, type ReactNode } from "react";
import parseNum from "../../../objects/number/parse";
import { attributesWithoutChildren, convertRemToPxNum } from "../../utilities/attributes";
import { CrossIcon, MenuIcon, MenuLeftIcon, MenuRightIcon } from "../icon";
import { NavigationContext, type NavigationHeaderMode, type NavigationMode, type NavigationPosition } from "../navigation-container/context";
import Style from "./index.module.scss";

type OmitAttributes = "color" | "children";
export type NavigationContainerProps = Omit<HTMLAttributes<HTMLDivElement>, OmitAttributes> & {
  $name?: string;
  $defaultNavPosition?: NavigationPosition;
  $navPosition?: NavigationPosition;
  $defaultNavMode?: NavigationMode;
  $navMode?: NavigationMode;
  $headerMode?: NavigationHeaderMode;
  $defaultHeaderMode?: NavigationHeaderMode;
  $headerTag?: ElementType;
  $footerTag?: ElementType;
  $navTag?: ElementType;
  $mainTag?: ElementType;
  $header?: ReactNode;
  $footer?: ReactNode;
  $nav?: ReactNode;
  $navTitle?: ReactNode;
  children: ReactNode;
};

const toggleVisId = "navTglVis";
const toggleMinId = "navTglMin";
const toggleMnuId = "navTglMnu";

const NavigationContainer = forwardRef<HTMLDivElement, NavigationContainerProps>((props, ref) => {
  const cref = useRef<HTMLDivElement>(null!);
  const nref = useRef<HTMLDivElement>(null!);
  const [navPos, setPosition] = useState(props.$defaultNavPosition);
  const [navMode, setMode] = useState(props.$defaultNavMode);
  const [headerMode, setHeaderMode] = useState(props.$defaultHeaderMode);

  const HeaderTag = props.$headerTag ?? "header";
  const FooterTag = props.$footerTag ?? "footer";
  const NavTag = props.$navTag ?? "nav";
  const MainTag = props.$mainTag ?? "main";

  const name = props.$name ?? "nav";
  const pos = props.$navPosition ?? navPos ?? "left";
  const mode = props.$navMode ?? navMode ?? "auto";
  const hmode = props.$headerMode ?? headerMode ?? "fill";

  const resetRadio = () => {
    const visElem = document.getElementById(`${name}_${toggleVisId}`) as HTMLInputElement;
    if (visElem) visElem.checked = false;
    const minElem = document.getElementById(`${name}_${toggleMinId}`) as HTMLInputElement;
    if (minElem) minElem.checked = false;
  };

  const getHeaderSizeNum = () => {
    if (typeof window === "undefined" || cref.current == null) return 0;
    return convertRemToPxNum(
      parseNum(
        (getComputedStyle(cref.current).getPropertyValue("--header-size") || "0rem").replace("rem", "")
      )
    ) ?? 0;
  };

  useEffect(() => {
    if (mode === "auto") {
      resetRadio();
    }
  }, [mode]);

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
        resetRadio,
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
      />
      <input
        className={Style.tglMin}
        id={`${name}_${toggleMinId}`}
        name={name}
        type="radio"
      />
      <input
        className={Style.tglMnu}
        id={`${name}_${toggleMnuId}`}
        type="checkbox"
      />
      <div
        {...attributesWithoutChildren(props, Style.wrap)}
        ref={ref}
        data-pos={pos}
        data-mode={mode}
        data-hmode={hmode}
      >
        <label
          className={Style.mask}
          htmlFor={`${name}_${toggleMnuId}`}
        />
        {props.$nav &&
          <NavTag
            className={Style.nav}
            onScroll={(e: React.UIEvent) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            data-pos={pos}
            data-mode={mode}
          >
            <div className={Style.corner}>
              <label
                className={`${Style.btn} ${Style.btnVis}`}
                htmlFor={`${name}_${toggleVisId}`}
              >
                <MenuLeftIcon className={Style.slideLeft} />
                <MenuRightIcon className={Style.slideRight} />
              </label>
              <label
                className={`${Style.btn} ${Style.btnMin}`}
                htmlFor={`${name}_${toggleMinId}`}
              >
                <MenuLeftIcon className={Style.slideLeft} />
                <MenuRightIcon className={Style.slideRight} />
              </label>
            </div>
            <div
              ref={nref}
              className={Style.ncontent}
            >
              {props.$nav}
            </div>
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
            <div
              className={Style.corner}
              data-mode={mode}
              ref={cref}
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