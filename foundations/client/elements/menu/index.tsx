"use client";

import { usePathname } from "next/navigation";
import { forwardRef, useEffect, useMemo, useRef, type FC, type HTMLAttributes, type Key, type ReactNode } from "react";
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
        $defaultOpenedIcon={props.$defaultOpenedIcon}
        $defaultClosedIcon={props.$defaultClosedIcon}
        $defaultIconSpace={props.$defaultIconSpace}
        $direction={props.$direction || "vertical"}
        $judgeSelected={props.$judgeSelected}
      />
    </div>
  );
});

const MenuGroup: FC<MenuProps & {
  $nestLevel?: number;
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
          $defaultOpenedIcon={props.$defaultOpenedIcon}
          $defaultClosedIcon={props.$defaultClosedIcon}
          $defaultIconSpace={props.$defaultIconSpace}
          $judgeSelected={props.$judgeSelected}
        />
      )}
    </ul>
  );
};

type MenuItemPropsImpl = MenuItemProps & {
  nestLevel: number;
  $defaultOpenedIcon?: ReactNode;
  $defaultClosedIcon?: ReactNode;
  $defaultIconSpace?: boolean;
  $toggleParent?: (open?: boolean, mountInit?: boolean) => void;
  $judgeSelected?: (props: AddonMenuItemProps) => boolean
};

const judgeSelected = (props: MenuItemPropsImpl, routerPathname: string | null) => {
  if (props.$judgeSelected == null) {
    const pathname = typeof props.pathname === "string" ? props.pathname : props.pathname?.pathname;
    return routerPathname === pathname;
  }
  return props.$judgeSelected(attributes(props) as AddonMenuItemProps);
};

const MenuItem: FC<MenuItemPropsImpl> = (props) => {
  const len = props.items?.length ?? 0;
  const nav = useNavigation();
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null!);
  const cref = useRef<HTMLDivElement>(null!);

  const selected = useMemo(() => {
    return judgeSelected(props, pathname);
  }, [pathname, props.$judgeSelected]);
  const selectable = Boolean(props.pathname) || len > 0 || props.onClick != null;

  const click = (e: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>) => {
    if (props.pathname) nav.closeMenu();
    props.onClick?.(props, e);
  };

  const keydown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.currentTarget.click();
    }
  };

  useEffect(() => {
    if (cref.current?.querySelector(`.${Style.content}[data-selected="true"]`)) {
      cref.current.style.setProperty("--tgl-trans-time", "0s");
      const checkElem = cref.current.parentElement?.querySelector(`:scope>input.${Style.check}`) as HTMLInputElement;
      if (checkElem) checkElem.checked = true;
      setTimeout(() => {
        cref.current.style.removeProperty("--tgl-trans-time");
      }, 0);
    }
    if (selected) {
      nav.scrollNavIntoView(ref.current);
    }
  }, []);

  const iconSpace = props.iconSpace ?? props.$defaultIconSpace;

  const node = (
    <div
      {...attributes(props.attributes, Style.content)}
      ref={ref}
      style={{
        ...props.attributes?.style,
        ["--menu-pad" as string]: `calc(var(--menu-nest-pad) * ${props.nestLevel})`,
      }}
      onClick={click}
      onKeyDown={keydown}
      tabIndex={selectable ? 0 : undefined}
      data-selectable={selectable}
      data-nest={props.nestLevel ?? 0}
      data-selected={selected}
    >
      {(props.icon || iconSpace) &&
        <div className={Style.icon}>
          {props.icon && <Text>{props.icon}</Text>}
        </div>
      }
      <div className={Style.node}>
        <Text className={Style.label}>{props.label}</Text>
      </div>
      {len > 0 &&
        <div className={Style.toggle}>
          <MinusIcon className={Style.close} />
          <PlusIcon className={Style.open} />
        </div>
      }
    </div>
  );

  return (
    <li className={Style.item}>
      <label>
        {len > 0 &&
          <input
            className={Style.check}
            type="checkbox"
            defaultChecked={props.defaultOpen}
          />
        }
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
          ref={cref}
          className={Style.children}
        >
          <div className={Style.childrenbody}>
            <MenuGroup
              $items={props.items}
              $nestLevel={props.nestLevel + 1}
              $defaultOpenedIcon={props.openedIcon ?? props.$defaultOpenedIcon}
              $defaultClosedIcon={props.closedIcon ?? props.$defaultClosedIcon}
              $defaultIconSpace={iconSpace}
            />
          </div>
        </div>
      </label>
    </li>
  );
};

export default Menu;