import React, { FC, HTMLAttributes, Key, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Style from "$/components/elements/menu.module.scss";
import { attributes, attributesWithoutChildren } from "@/components/utilities/attributes";
import { VscAdd, VscChromeMinimize } from "react-icons/vsc";
import useToggleAnimation from "@/hooks/toggle-animation";
import { useRouter } from "next/router";
import { useNavigation } from "@/components/elements/navigation-container";
import NextLink from "@/components/elements/link";
import LabelText from "@/components/elements/label-text";

type ItemAttributes = Omit<HTMLAttributes<HTMLDivElement>, "children" | "onClick" | "onKeyDown">;

export type MenuItemProps = {
  key?: Key;
  pathname?: string;
  label?: ReactNode;
  icon?: ReactNode;
  items?: Array<MenuItemProps>;
  attributes?: ItemAttributes;
  openedIcon?: ReactNode;
  closedIcon?: ReactNode;
  defaultOpen?: boolean;
  onClick?: (props: AddonMenuItemProps, e: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>) => void;
};
type AddonMenuItemProps = MenuItemProps & { nestLevel: number; };

type Direction = "vertical" | "horizontal";

export type MenuProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  $items?: Array<MenuItemProps>;
  $direction?: Direction;
  $itemDefaultAttributes?: ItemAttributes;
  $defaultOpenedIcon?: ReactNode;
  $defaultClosedIcon?: ReactNode;
  $judgeSelected?: (props: AddonMenuItemProps) => boolean;
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
  $items?: Array<MenuItemProps>;
  $nestLevel?: number;
  $direction?: Direction;
  $itemDefaultAttributes?: ItemAttributes;
  $defaultOpenedIcon?: ReactNode;
  $defaultClosedIcon?: ReactNode;
  $toggleParent?: (open?: boolean, mountInit?: boolean) => void;
  $judgeSelected?: (props: AddonMenuItemProps) => boolean
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
          $itemDefaultAttributes={props.$itemDefaultAttributes}
          $defaultOpenedIcon={props.$defaultOpenedIcon}
          $defaultClosedIcon={props.$defaultClosedIcon}
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
  $toggleParent?: (open?: boolean, mountInit?: boolean) => void;
  $judgeSelected?: (props: AddonMenuItemProps) => boolean
};

const judgeSelected = (props: MenuItemPropsImpl, routerPathname: string) => {
  if (props.$judgeSelected == null) {
    return routerPathname === props.pathname;
  }
  return props.$judgeSelected(attributes(props) as AddonMenuItemProps);
};

const MenuItem: FC<MenuItemPropsImpl> = (props) => {
  const router = useRouter();
  const nav = useNavigation();
  const ref = useRef<HTMLDivElement>(null!);
  const attrs = {
    ...props.$itemDefaultAttributes,
    ...props.attributes
  };

  const selected = useMemo(() => {
    return judgeSelected(props, router.pathname);
  }, [router.pathname, props.$judgeSelected]);
  const selectable = Boolean(router.pathname) || (props.items?.length ?? 0) > 0 || props.onClick != null;

  const [showItems, setShowItems] = useState(() => {
    if (props.defaultOpen != null) return props.defaultOpen;
    const func = (p: AddonMenuItemProps) => {
      if (p !== props && judgeSelected({ ...p, $judgeSelected: props.$judgeSelected }, router.pathname)) return true;
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
    if (props.pathname) nav.toggle(false);
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
  }, []);

  const toggleAnimationInitStyle = useToggleAnimation({
    elementRef: ref,
    open: showItems,
    direction: "vertical",
    animationDuration: Math.min(250, (props.items?.length ?? 0) * 30),
  });

  const node = (
    <div
      {...attrs}
      className={`${Style.content}${attrs.className ? ` ${attrs.className}` : ""}`}
      style={{ ...attrs.style, paddingLeft: `calc(1.5rem * ${props.nestLevel})` }}
      onClick={click}
      onKeyDown={keydown}
      data-selectable={selectable}
      data-nest={props.nestLevel ?? 0}
      data-selected={selected}
      tabIndex={selectable ? 0 : undefined}
    >
      {props.icon &&
        <div className={Style.icon}>
          <LabelText>{props.icon}</LabelText>
        </div>
      }
      <div className={Style.node}>
        <LabelText className={Style.label}>{props.label}</LabelText>
      </div>
      <div className={Style.toggle}>
        {props.items == null || props.items.length === 0 ? <></> :
          showItems ?
            props.openedIcon ?? props.$defaultOpenedIcon ?? <VscChromeMinimize /> :
            props.closedIcon ?? props.$defaultClosedIcon ?? <VscAdd />
        }
      </div>
    </div>
  );

  return (
    <li className={Style.item}>
      {props.pathname == null ? node :
        <NextLink
          $noDecoration
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
        />
      </div>
    </li>
  );
};

export default Menu;