"use client";

import { usePathname } from "next/navigation";
import { forwardRef, useCallback, useEffect, useMemo, useRef, useState, type FC, type HTMLAttributes, type Key, type ReactNode } from "react";
import useToggleAnimation from "../../hooks/toggle-animation";
import { attributes, attributesWithoutChildren } from "../../utilities/attributes";
import { MinusIcon, PlusIcon } from "../icon";
import NextLink, { type NextLinkProps } from "../link";
import { useNavigation } from "../navigation-container/context";
import Text from "../text";
import Style from "./index.module.scss";

type ItemAttributes = Omit<HTMLAttributes<HTMLDivElement>, "children" | "onClick" | "onKeyDown">;

export type MenuItemProps = {
  key?: Key;
  pathname?: NextLinkProps["href"];
  label?: ReactNode;
  icon?: ReactNode;
  items?: Array<MenuItemProps | null | undefined>;
  attributes?: ItemAttributes;
  openedIcon?: ReactNode;
  closedIcon?: ReactNode;
  defaultOpen?: boolean;
  iconSpace?: boolean;
  onClick?: (props: AddonMenuItemProps, e: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>) => void;
};
type AddonMenuItemProps = MenuItemProps & { nestLevel: number; };

type Direction = "vertical" | "horizontal";

type OmitAttributes = "color" | "children";
export type MenuProps = Omit<HTMLAttributes<HTMLDivElement>, OmitAttributes> & {
  $items?: Array<MenuItemProps | null | undefined>;
  $direction?: Direction;
  $itemDefaultAttributes?: ItemAttributes;
  $defaultOpenedIcon?: ReactNode;
  $defaultClosedIcon?: ReactNode;
  $defaultIconSpace?: boolean;
  $judgeSelected?: (props: AddonMenuItemProps) => boolean;
};

const Menu = forwardRef<HTMLDivElement, MenuProps>((props, ref) => {
  return (
    <div
      {...attributesWithoutChildren(props, Style.wrap)}
      ref={ref}
    >
      <MenuGroup
        className={Style.root}
        $items={props.$items}
        $itemDefaultAttributes={props.$itemDefaultAttributes}
        $defaultOpenedIcon={props.$defaultOpenedIcon}
        $defaultClosedIcon={props.$defaultClosedIcon}
        $direction={props.$direction || "vertical"}
        $judgeSelected={props.$judgeSelected}
      />
    </div>
  );
});

const MenuGroup: FC<MenuProps & {
  $nestLevel?: number;
  $toggleParent?: (open?: boolean, mountInit?: boolean) => void;
}> = (props) => {
  if (props.$items == null || props.$items.length === 0) return <></>;
  return (
    <ul
      {...attributesWithoutChildren(props, Style.list)}
      data-direction={props.$direction}
    >
      {props.$items.filter(item => item != null).map((item, index) =>
        <MenuItem
          {...item}
          key={item!.key ?? index}
          nestLevel={props.$nestLevel ?? 0}
          $itemDefaultAttributes={props.$itemDefaultAttributes}
          $defaultOpenedIcon={props.$defaultOpenedIcon}
          $defaultClosedIcon={props.$defaultClosedIcon}
          $defaultIconSpace={props.$defaultIconSpace}
          $toggleParent={props.$toggleParent}
          $judgeSelected={props.$judgeSelected}
        />
      )}
    </ul>
  );
};

type MenuItemPropsImpl = MenuItemProps & {
  nestLevel: number;
  $itemDefaultAttributes?: ItemAttributes;
  $defaultOpenedIcon?: ReactNode;
  $defaultClosedIcon?: ReactNode;
  $defaultIconSpace?: boolean;
  $toggleParent?: (open?: boolean, mountInit?: boolean) => void;
  $judgeSelected?: (props: AddonMenuItemProps) => boolean
};

const judgeSelected = (props: MenuItemPropsImpl, routerPathname: string | null) => {
  const pathname = typeof props.pathname === "string" ? props.pathname : props.pathname?.pathname;
  if (props.$judgeSelected == null) {
    return routerPathname === pathname;
  }
  return props.$judgeSelected(attributes(props) as AddonMenuItemProps);
};

const MenuItem: FC<MenuItemPropsImpl> = (props) => {
  const nav = useNavigation();
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null!);
  const attrs = {
    ...props.$itemDefaultAttributes,
    ...props.attributes
  };

  const selected = useMemo(() => {
    return judgeSelected(props, pathname);
  }, [pathname, props.$judgeSelected]);
  const selectable = Boolean(pathname) || (props.items?.length ?? 0) > 0 || props.onClick != null;

  const [showItems, setShowItems] = useState(() => {
    if (props.defaultOpen != null) return props.defaultOpen;
    const func = (p: AddonMenuItemProps) => {
      if (p !== props && judgeSelected({ ...p, $judgeSelected: props.$judgeSelected }, pathname)) return true;
      if (p.items == null || p.items.length === 0) return false;
      for (let i = 0, il = p.items.length; i < il; i++) {
        if (func({ ...p.items[i], nestLevel: p.nestLevel + 1 })) return true;
      }
      return false;
    };
    return func(props);
  });

  const click = (e: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>) => {
    setShowItems(c => !c);
    nav.closeMenu();
    props.onClick?.(props, e);
  };

  const keydown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      click(e);
    }
  };

  const toggle = useCallback((open?: boolean, mountInit?: boolean) => {
    if (open && mountInit && props.defaultOpen === false) return;
    if (open == null) {
      setShowItems(c => !c);
      return;
    }
    setShowItems(open);
    if (open) props.$toggleParent?.(open);
  }, []);

  useEffect(() => {
    if (props.nestLevel > 0 && selected) {
      props.$toggleParent?.(true, true);
    }
    if (selected) {
      setTimeout(() => {
        ref.current?.scrollIntoView({ block: "start" });
      }, 1000);
    }
  }, []);

  const toggleAnimationInitStyle = useToggleAnimation({
    elementRef: ref,
    open: showItems,
    direction: "vertical",
    animationDuration: Math.min(250, (props.items?.length ?? 0) * 30),
  });

  const iconSpace = props.iconSpace ?? props.$defaultIconSpace;

  const node = (
    <div
      {...attrs}
      className={`${Style.content}${attrs.className ? ` ${attrs.className}` : ""}`}
      style={{ ...attrs.style, ["--menu-pad" as string]: `calc(var(--menu-nest-pad) * ${props.nestLevel})` }}
      onClick={click}
      onKeyDown={keydown}
      data-selectable={selectable}
      data-nest={props.nestLevel ?? 0}
      data-selected={selected}
      tabIndex={selectable ? 0 : undefined}
    >
      {(props.icon || iconSpace) &&
        <div className={Style.icon}>
          {props.icon &&
            <Text>{props.icon}</Text>
          }
        </div>
      }
      <div className={Style.node}>
        <Text className={Style.label}>{props.label}</Text>
      </div>
      {props.items != null && props.items.length > 0 &&
        <div className={Style.toggle}>
          {props.items == null || props.items.length === 0 ? <></> :
            showItems ?
              props.openedIcon ?? props.$defaultOpenedIcon ?? <MinusIcon /> :
              props.closedIcon ?? props.$defaultClosedIcon ?? <PlusIcon />
          }
        </div>
      }
    </div>
  );

  return (
    <li className={Style.item}>
      {props.pathname == null ? node :
        <NextLink
          $noDecoration
          prefetch={false}
          href={props.pathname}
        >
          {node}
        </NextLink>
      }
      <div
        ref={ref}
        className={Style.children}
        style={toggleAnimationInitStyle}
      >
        <MenuGroup
          $items={props.items}
          $nestLevel={props.nestLevel + 1}
          $toggleParent={toggle}
          $itemDefaultAttributes={attrs}
          $defaultOpenedIcon={props.openedIcon ?? props.$defaultOpenedIcon}
          $defaultClosedIcon={props.closedIcon ?? props.$defaultClosedIcon}
          $defaultIconSpace={iconSpace}
        />
      </div>
    </li>
  );
};

export default Menu;