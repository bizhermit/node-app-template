import React, { CSSProperties, FC, HTMLAttributes, Key, ReactNode, useCallback, useEffect, useRef, useState } from "react";
import Style from "@/styles/components/elements/menu.module.scss";
import { attributesWithoutChildren, isReactNode } from "@/utilities/attributes";
import { VscAdd, VscChromeMinimize } from "react-icons/vsc";
import useAccordionEffect from "@/hooks/accordion";
import { useRouter } from "next/router";
import { useNavigation } from "@/components/elements/navigation-container";

export type MenuItemProps = {
  key?: Key;
  className?: string;
  style?: CSSProperties;
  pathname?: string;
  label?: ReactNode;
  icon?: ReactNode;
  items?: Array<MenuItemProps>;
  onClick?: (props: MenuItemProps & { nestLevel: number; }) => void;
};

type Direction = "vertical" | "horizontal";

export type MenuProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  $items?: Array<MenuItemProps>;
  $direction?: Direction;
};

const Menu = React.forwardRef<HTMLDivElement, MenuProps>((props, ref) => {
  return (
    <div
      {...attributesWithoutChildren(props, Style.wrap)}
      ref={ref}
    >
      <MenuGroup
        className={Style.root}
        $items={props.$items}
        $direction={props.$direction || "vertical"}
      />
    </div>
  );
});

const MenuGroup: FC<MenuProps & {
  $items?: Array<MenuItemProps>;
  $nestLevel?: number;
  $direction?: Direction;
  $toggleParent?: (open?: boolean) => void;
}> = (props) => {
  if (props.$items == null || props.$items.length === 0) return <></>;
  return (
    <ul
      {...attributesWithoutChildren(props, Style.list)}
      data-direction={props.$direction}
    >
      {props.$items.map((item, index) =>
        <MenuItem
          {...item}
          key={item.key ?? index}
          nestLevel={props.$nestLevel ?? 0}
          toggleParent={props.$toggleParent}
        />
      )}
    </ul>
  );
};

const MenuItem: FC<MenuItemProps & {
  nestLevel: number;
  toggleParent?: (open?: boolean) => void;
}> = (props) => {
  const router = useRouter();
  const nav = useNavigation();
  const [showItems, setShowItems] = useState(false);
  const ref = useRef<HTMLDivElement>(null!);

  const click = () => {
    setShowItems(c => !c);
    if (props.pathname) nav.toggle(false);
    props.onClick?.(props);
  };

  const keydown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      click();
    }
  };

  const toggle = useCallback((open?: boolean) => {
    if (open == null) {
      setShowItems(c => !c);
      return;
    }
    setShowItems(open);
    if (open) props.toggleParent?.(open);
  }, []);

  useEffect(() => {
    if (props.nestLevel > 0 && router.pathname === props.pathname) {
      props.toggleParent?.(true);
    }
  }, []);

  useAccordionEffect({
    elementRef: ref,
    open: showItems,
  });

  const selectable = Boolean(router.pathname) || (props.items?.length ?? 0) > 0 || props.onClick != null;

  return (
    <li className={Style.item}>
      <div
        className={`${Style.content}${props.className ? ` ${props.className}` : ""}`}
        style={{ paddingLeft: `calc(1.5rem * ${props.nestLevel})`, ...props.style }}
        onClick={click}
        onKeyDown={keydown}
        data-selectable={selectable}
        data-nest={props.nestLevel ?? 0}
        data-selected={router.pathname === props.pathname}
        tabIndex={selectable ? 0 : undefined}
      >
        {props.icon &&
          <div className={Style.icon}>
            {props.icon}
          </div>
        }
        <div className={Style.node}>
          {isReactNode(props.label) ? props.label :
            <span className={Style.label}>{props.label}</span>
          }
        </div>
        {props.items == null || props.items.length === 0 ? <></> :
          <div className={Style.toggle}>
            {showItems ? <VscChromeMinimize /> : <VscAdd />}
          </div>
        }
      </div>
      <div
        ref={ref}
        className={Style.children}
      >
        <MenuGroup
          $items={props.items}
          $nestLevel={props.nestLevel + 1}
          $toggleParent={toggle}
        />
      </div>
    </li>
  );
};

export default Menu;