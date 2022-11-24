import React, { CSSProperties, FC, HTMLAttributes, Key, ReactNode } from "react";
import Style from "@/styles/components/elements/menu.module.scss";
import { attributesWithoutChildren } from "@/utilities/attributes";

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

export type MenuProps = HTMLAttributes<HTMLUListElement> & {
  $items?: Array<MenuItemProps>;
  $direction?: Direction;
};

const Menu = React.forwardRef<HTMLUListElement, MenuProps>((props, ref) => {
  return (
    <MenuGroup
      {...props}
      className={`${Style.root}${props.className ? ` ${props.className}` : ""}`}
      $direction={props.$direction || "vertical"}
      ref={ref}
    />
  );
});

const MenuGroup = React.forwardRef<HTMLUListElement, MenuProps & {
  $items?: Array<MenuItemProps>;
  $nestLevel?: number;
  $direction?: Direction;
  $toggleParent?: (open?: boolean) => void;
}>((props, ref) => {
  if (props.$items == null || props.$items.length === 0) return <></>;
  return (
    <ul
      {...attributesWithoutChildren(props, Style.group)}
      ref={ref}
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
});

const MenuItem: FC<MenuItemProps & {
  nestLevel: number;
  toggleParent?: (open?: boolean) => void;
}> = (props) => {

  const toggle = () => {

  };

  return (
    <li className={Style.wrap}>
      <div
        className={`${Style.item}${props.className ? ` ${props.className}` : ""}`}
        style={props.style}
      >
        <div className={Style.icon}></div>
        <span>{props.label}</span>
      </div>
      <div
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