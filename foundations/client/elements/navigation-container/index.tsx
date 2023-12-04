"use client";

import { forwardRef, useRef, useState, type ElementType, type HTMLAttributes, type ReactNode } from "react";
import { attributesWithoutChildren } from "../../utilities/attributes";
import { CrossIcon, MenuIcon, MenuLeftIcon, MenuRightIcon } from "../icon";
import { NavigationContext, type NavigationMode, type NavigationPosition } from "../navigation-container/context";
import Style from "./index.module.scss";

type OmitAttributes = "color" | "children";
export type NavigationContainerProps = Omit<HTMLAttributes<HTMLDivElement>, OmitAttributes> & {
  $name?: string;
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

const toggleVisId = "navTglVis";
const toggleMinId = "navTglMin";
const toggleMnuId = "navTglMnu";

const NavigationContainer = forwardRef<HTMLDivElement, NavigationContainerProps>((props, ref) => {
  const cref = useRef<HTMLDivElement>(null!);
  const [navPos, setNavPos] = useState(props.$defaultNavPosition);
  const [navMode, setNavMode] = useState(props.$defaultNavMode);

  const HeaderTag = props.$headerTag ?? "header";
  const FooterTag = props.$footerTag ?? "footer";
  const NavTag = props.$navTag ?? "nav";
  const MainTag = props.$mainTag ?? "main";

  const name = props.$name ?? "nav";
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
          const m = cref.current?.getAttribute("data-mode") as NavigationMode;
          if (!(m === "auto" || m === "manual")) return;
          (Array.from(cref.current.querySelectorAll(":scope>label")) as Array<HTMLLabelElement>).find(elem => {
            return getComputedStyle(elem).display !== "none";
          })?.click();
        },
        resetRadio: () => {
          const visElem = document.getElementById(`${name}_${toggleVisId}`) as HTMLInputElement;
          if (visElem) visElem.checked = false;
          const minElem = document.getElementById(`${name}_${toggleMinId}`) as HTMLInputElement;
          if (minElem) minElem.checked = false;
        },
        closeMenu: () => {
          const mnuElem = document.getElementById(`${name}_${toggleMnuId}`) as HTMLInputElement;
          if (mnuElem) mnuElem.checked = false;
        }
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
            <div
              className={Style.corner}
              ref={cref}
              data-mode={mode}
            >
              <label
                className={Style.btnVis}
                htmlFor={`${name}_${toggleVisId}`}
              >
                <MenuLeftIcon className={Style.slideLeft} />
                <MenuRightIcon className={Style.slideRight} />
              </label>
              <label
                className={Style.btnMin}
                htmlFor={`${name}_${toggleMinId}`}
              >
                <MenuLeftIcon className={Style.slideLeft} />
                <MenuRightIcon className={Style.slideRight} />
              </label>
              <label
                className={Style.btnMnu}
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