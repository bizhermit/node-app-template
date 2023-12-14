"use client";

import { usePathname } from "next/navigation";
import { forwardRef, useEffect, useRef, type FC, type HTMLAttributes, type Key, type ReactNode } from "react";
import equals from "../../../objects/equal";
import { attrs } from "../../utilities/attributes";
import { MinusIcon, PlusIcon } from "../icon";
import NextLink, { type Href } from "../link";
import { useNavigation } from "../navigation-container/context";
import Text from "../text";
import Style from "./index.module.scss";

type Direction = "vertical" | "horizontal";

type MenuBaseOptions = {
  items?: Array<MenuItemProps | null | undefined>;
  defaultOpenedIcon?: ReactNode;
  closedIcon?: ReactNode;
  defaultOpen?: boolean;
  iconSpace?: boolean;
};

type MenuItemOptions = MenuBaseOptions & {
  key?: Key;
  pathname?: Href;
  query?: { [v: string | number | symbol]: any };
  label?: ReactNode;
  icon?: ReactNode;
  onClick?: (
    ctx: { props: Omit<MenuItemProps, "onClick">; nestLevel: number },
    e: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>
  ) => void;
};

export type MenuItemProps = OverwriteAttrs<HTMLAttributes<HTMLDivElement>, MenuItemOptions>;

type MenuOptions = MenuBaseOptions & {
  direction?: Direction;
  judgeSelected?: (props: MenuItemProps, nestLevel: number) => boolean;
};

export type MenuProps = OverwriteAttrs<HTMLAttributes<HTMLDivElement>, MenuOptions>;

const Menu = forwardRef<HTMLDivElement, MenuProps>(({
  items,
  direction,
  defaultOpenedIcon: openedIcon,
  closedIcon,
  iconSpace,
  judgeSelected,
  ...props
}, ref) => {
  return (
    <div
      {...attrs(props, Style.wrap)}
      ref={ref}
    >
      <MenuGroup
        className={Style.root}
        items={items}
        defaultOpenedIcon={openedIcon}
        closedIcon={closedIcon}
        iconSpace={iconSpace}
        direction={direction || "vertical"}
        judgeSelected={judgeSelected}
      />
    </div>
  );
});

const MenuGroup: FC<MenuProps & { nestLevel?: number }> = (props) => {
  if (props.items == null || props.items.length === 0) return <></>;
  return (
    <ul
      className={Style.list}
      data-direction={props.direction}
    >
      {props.items.filter(item => item != null).map((item, index) =>
        <MenuItem
          {...item}
          key={item!.key ?? index}
          nestLevel={props.nestLevel ?? 0}
          defaultOpenedIcon={props.defaultOpenedIcon}
          defaultClosedIcon={props.closedIcon}
          defaultIconSpace={props.iconSpace}
          judgeSelected={props.judgeSelected}
        />
      )}
    </ul>
  );
};

type MenuItemPropsImpl = MenuItemProps & {
  nestLevel: number;
  defaultOpenedIcon?: ReactNode;
  defaultClosedIcon?: ReactNode;
  defaultIconSpace?: boolean;
  judgeSelected?: (props: MenuItemProps, nestLevel: number) => boolean
};

const MenuItem: FC<MenuItemPropsImpl> = ({
  items,
  pathname,
  query,
  onClick,
  nestLevel,
  defaultOpenedIcon,
  defaultClosedIcon,
  defaultIconSpace,
  defaultOpen,
  judgeSelected,
  ...props
}) => {
  const len = items?.length ?? 0;
  const nav = useNavigation();
  const currentPathname = usePathname();
  const ref = useRef<HTMLDivElement>(null!);
  const cref = useRef<HTMLDivElement>(null!);

  const selected = judgeSelected == null ? equals(currentPathname, pathname) : judgeSelected(props, nestLevel);
  const selectable = Boolean(pathname) || len > 0 || onClick != null;

  const click = (e: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>) => {
    if (pathname) nav.closeMenu();
    onClick?.({ props: { ...props, items, pathname, query }, nestLevel }, e);
  };

  const keydown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.currentTarget.click();
    }
    props.onKeyDown?.(e);
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
      setTimeout(() => {
        nav.scrollNavIntoView(ref.current, { behavior: "smooth" });
      }, 0);
    }
  }, []);

  const iconSpace = props.iconSpace ?? defaultIconSpace;

  const node = (
    <div
      {...attrs(props, Style.content)}
      ref={ref}
      style={{
        ...props?.style,
        ["--menu-pad" as string]: `calc(var(--menu-nest-pad) * ${nestLevel})`,
      }}
      onClick={click}
      onKeyDown={keydown}
      tabIndex={selectable ? (props.tabIndex ?? 0) : -1}
      data-selectable={selectable}
      data-nest={nestLevel ?? 0}
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
            defaultChecked={defaultOpen}
          />
        }
        {!pathname ? node :
          <NextLink
            className={Style.link}
            prefetch={false}
            href={pathname}
            query={query}
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
              items={items}
              nestLevel={nestLevel + 1}
              defaultOpenedIcon={defaultOpenedIcon}
              closedIcon={defaultClosedIcon}
              iconSpace={iconSpace}
            />
          </div>
        </div>
      </label>
    </li>
  );
};

export default Menu;