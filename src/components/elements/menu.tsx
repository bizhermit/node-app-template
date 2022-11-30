import React, { CSSProperties, FC, HTMLAttributes, Key, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Style from "$/components/elements/menu.module.scss";
import { attributes, attributesWithoutChildren } from "@/utilities/attributes";
import { VscAdd, VscChromeMinimize } from "react-icons/vsc";
import useToggleAnimation from "@/hooks/toggle-animation";
import { useRouter } from "next/router";
import { useNavigation } from "@/components/elements/navigation-container";
import NextLink from "@/components/elements/link";
import LabelText from "@/pages/sandbox/elements/label-text";

export type MenuItemProps = {
  key?: Key;
  className?: string;
  style?: CSSProperties;
  pathname?: string;
  label?: ReactNode;
  icon?: ReactNode;
  items?: Array<MenuItemProps>;
  onClick?: (props: AddonMenuItemProps) => void;
};
type AddonMenuItemProps = MenuItemProps & { nestLevel: number; };

type Direction = "vertical" | "horizontal";

export type MenuProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  $items?: Array<MenuItemProps>;
  $direction?: Direction;
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
  $toggleParent?: (open?: boolean) => void;
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
          $toggleParent={props.$toggleParent}
          $judgeSelected={props.$judgeSelected}
        />
      )}
    </ul>
  );
};

const MenuItem: FC<MenuItemProps & {
  nestLevel: number;
  $toggleParent?: (open?: boolean) => void;
  $judgeSelected?: (props: AddonMenuItemProps) => boolean
}> = (props) => {
  const router = useRouter();
  const nav = useNavigation();
  const [showItems, setShowItems] = useState(false);
  const ref = useRef<HTMLDivElement>(null!);

  const selected = useMemo(() => {
    if (props.$judgeSelected == null) {
      return router.pathname === props.pathname;
    }
    return props.$judgeSelected(attributes(props) as AddonMenuItemProps);
  }, [router.pathname, props.$judgeSelected]);
  const selectable = Boolean(router.pathname) || (props.items?.length ?? 0) > 0 || props.onClick != null;

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
    if (open) props.$toggleParent?.(open);
  }, []);

  useEffect(() => {
    if (props.nestLevel > 0 && selected) {
      props.$toggleParent?.(true);
    }
  }, []);

  useToggleAnimation({
    elementRef: ref,
    open: showItems,
    direction: "vertical",
  });

  const node = (
    <div
      className={`${Style.content}${props.className ? ` ${props.className}` : ""}`}
      style={{ paddingLeft: `calc(1.5rem * ${props.nestLevel})`, ...props.style }}
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
      {props.items == null || props.items.length === 0 ? <></> :
        <div className={Style.toggle}>
          {showItems ? <VscChromeMinimize /> : <VscAdd />}
        </div>
      }
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