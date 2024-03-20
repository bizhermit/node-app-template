import { forwardRef, useEffect, useRef, useState, type ButtonHTMLAttributes, type HTMLAttributes, type ReactNode } from "react";
import { isNotNull } from "../../../objects/empty";
import parseNum from "../../../objects/number/parse";
import joinCn from "../../utilities/join-class-name";
import { isNotReactNode } from "../../utilities/react-node";
import { convertSizeNumToStr } from "../../utilities/size";
import useForm from "../form/context";
import { DownIcon } from "../icon";
import Popup, { type PopupPosition } from "../popup";
import type { ButtonOptions } from "./index";
import Style from "./index.module.scss";

type SelectButtonSourceItem = {
  listItemChildren?: ReactNode;
} & Pick<ButtonHTMLAttributes<HTMLButtonElement>,
  | "type"
  | "formMethod"
  | "disabled"
  | "children"
> & Pick<ButtonOptions,
  | "$color"
  | "$icon"
  | "$iconPosition"
  | "$fillLabel"
  | "$fitContent"
  | "$noPadding"
  | "$notDependsOnForm"
  | "onClick"
>;

export type SelectButtonOptions = {
  $source: [SelectButtonSourceItem, ...Array<SelectButtonSourceItem>];
  $disabled?: boolean;
  $position?: PopupPosition;
} & Pick<ButtonOptions,
  | "$size"
  | "$color"
  | "$round"
  | "$outline"
  | "$text"
  | "$iconPosition"
  | "$fillLabel"
  | "$fitContent"
  | "$noPadding"
  | "$focusWhenMounted"
  | "$notDependsOnForm"
>;

type OmitAttrs = "children" | "onClick";
export type SelectButtonProps = OverwriteAttrs<Omit<HTMLAttributes<HTMLDivElement>, OmitAttrs>, SelectButtonOptions>;

const SelectButton = forwardRef<HTMLDivElement, SelectButtonProps>(({
  className,
  $disabled,
  $size,
  $color,
  $round,
  $outline,
  $text,
  $iconPosition,
  $fillLabel,
  $fitContent,
  $noPadding,
  $focusWhenMounted,
  $notDependsOnForm,
  $source,
  $position,
  ...props
}, $ref) => {
  const bref = useRef<HTMLButtonElement>(null!);
  const [buttonIndex, setButtonIndex] = useState(0);
  const button = $source[buttonIndex];
  const [showPicker, setShowPicker] = useState(false);
  const lref = useRef<HTMLDivElement>(null!);

  const form = useForm();
  const submitDisabled = (button.$notDependsOnForm ?? $notDependsOnForm) !== true && (
    form.disabled ||
    (button.type === "submit" && button.formMethod !== "delete" && (form.hasError || form.submitting)) ||
    (button.type === "reset" && (form.readOnly || form.submitting))
  );

  const disabledRef = useRef(false);
  const [disabled, setDisabled] = useState(disabledRef.current);

  const click = (e: React.MouseEvent<HTMLButtonElement>) => {
    if ($disabled || button.disabled || disabledRef.current || submitDisabled) {
      e.preventDefault();
      return;
    }
    setDisabled(disabledRef.current = true);
    const unlock = () => setDisabled(disabledRef.current = false);
    const res = button.onClick?.(unlock, e);
    if (res == null || typeof res === "boolean") {
      if (res !== true) unlock();
    }
  };

  const openPicker = () => {
    if ($disabled || disabled) return;
    setShowPicker(true);
  };

  const closePicker = () => {
    setShowPicker(false);
    if (!bref.current) return;
    if (bref.current.disabled) (bref.current.nextElementSibling as HTMLElement)?.focus();
    else bref.current?.focus();
  };

  const selectItem = (elem: HTMLElement) => {
    if (elem == null) return;
    try {
      const index = parseNum(elem.getAttribute("data-index"));
      if (isNotNull(index)) setButtonIndex(index);
      closePicker();
    } catch {
      return;
    }
  };

  const isListItem = (element: HTMLElement) => {
    let elem = element;
    while (elem != null) {
      if (elem.tagName === "DIV" && elem.hasAttribute("data-index")) break;
      elem = elem.parentElement as HTMLElement;
    }
    return elem;
  };

  const scrollToSelectedItem = () => {
    if (lref.current == null) return;
    let elem = lref.current.querySelector(`div[data-current="true"]`) as HTMLElement;
    if (elem == null) elem = lref.current.querySelector("div[data-index]") as HTMLElement;
    if (elem) {
      lref.current.scrollTop = elem.offsetTop + elem.offsetHeight / 2 - lref.current.clientHeight / 2;
      elem.focus();
    } else {
      lref.current.focus();
    }
  };

  const keyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    switch (e.code) {
      case "Escape":
        closePicker();
        break;
      case "F2":
      case "ArrowUp":
      case "ArrowDown":
        if (showPicker && lref.current) {
          scrollToSelectedItem();
        } else {
          openPicker();
        }
        e.stopPropagation();
        e.preventDefault();
        break;
      default:
        break;
    }
  };

  const keyDonwItem = (e: React.KeyboardEvent<HTMLDivElement>) => {
    switch (e.code) {
      case "ArrowUp":
        const prevElem = document.activeElement?.previousElementSibling as HTMLElement;
        if (prevElem) {
          const st = prevElem.offsetTop;
          const curSt = lref.current.scrollTop;
          if (st < curSt) lref.current.scrollTop = st;
          prevElem.focus();
        }
        e.preventDefault();
        e.stopPropagation();
        break;
      case "ArrowDown":
        const nextElem = document.activeElement?.nextElementSibling as HTMLElement;
        if (nextElem) {
          const st = nextElem.offsetTop - lref.current.clientHeight + nextElem.offsetHeight;
          const curSt = lref.current.scrollTop;
          if (st > curSt) lref.current.scrollTop = st;
          nextElem.focus();
        }
        e.preventDefault();
        e.stopPropagation();
        break;
      case "Escape":
        closePicker();
        break;
      case "Enter":
        selectItem(isListItem(e.target as HTMLElement));
        e.preventDefault();
        break;
      default:
        break;
    }
  };

  const clickItem = (e: React.MouseEvent<HTMLDivElement>) => {
    selectItem(isListItem(e.target as HTMLElement));
  };

  const formEnable = !form.disabled && !form.readOnly;

  useEffect(() => {
    if ($focusWhenMounted && formEnable) {
      bref.current?.focus();
    }
  }, [formEnable]);

  return (
    <div
      {...props}
      className={joinCn(Style.select, className)}
      ref={$ref}
    >
      <button
        className={joinCn(Style.wrap, className)}
        ref={bref}
        type={button.type ?? "button"}
        disabled={$disabled || button.disabled || submitDisabled || disabled}
        onClick={click}
        data-color={button.$color ?? $color}
        data-size={$size || "m"}
        data-wide={!(button.$fitContent ?? $fitContent) && button.children != null}
        data-round={$round}
        onKeyDown={keyDown}
      >
        <div
          className={Style.main}
          data-outline={$outline}
          data-text={$text}
          data-icon={button.$icon != null && (button.$iconPosition || $iconPosition || "left")}
        >
          {button.$icon != null && <div className={Style.icon}>{button.$icon}</div>}
          <div
            className={Style.label}
            data-fill={button.$fillLabel ?? $fillLabel}
            data-pt={isNotReactNode(button.children)}
            data-pad={!(button.$noPadding ?? $noPadding)}
          >
            {button.children}
          </div>
        </div>
      </button>
      <div
        className={Style.pull}
        data-color={$color}
        data-outline={$outline}
        data-text={$text}
        data-disabled={$disabled || disabled}
        onClick={() => {
          if (!showPicker) openPicker();
        }}
        onKeyDown={e => {
          if (e.code === "Space" || e.code === "Enter" || e.code === "F2" || e.code === "ArrowUp" || e.code === "ArrowDown") {
            openPicker();
            e.preventDefault();
            e.stopPropagation();
          }
        }}
        tabIndex={($disabled || button.disabled || submitDisabled || disabled) ? 0 : -1}
      >
        <DownIcon className={Style.down} />
      </div>
      <Popup
        className={Style.popup}
        $show={showPicker && !($disabled || disabled)}
        $onToggle={(open, { anchorElement, popupElement }) => {
          if (open && anchorElement && popupElement) {
            popupElement.style.minWidth = convertSizeNumToStr(anchorElement.offsetWidth);
          }
          open ? openPicker() : closePicker();
        }}
        $onToggled={(open) => {
          if (open) scrollToSelectedItem();
        }}
        $anchor="parent"
        $position={$position ?? {
          x: "inner",
          y: "outer",
        }}
        $animationDuration={80}
        $animationDirection="vertical"
        $mask="transparent"
        $preventFocus
        $closeWhenClick
      >
        <div
          className={Style.list}
          ref={lref}
          onKeyDown={keyDonwItem}
          onClick={clickItem}
          tabIndex={-1}
        >
          {$source.map((item, i) => {
            return (
              <div
                className={Style.item}
                key={i}
                tabIndex={0}
                data-index={i}
                data-current={i === buttonIndex}
              >
                {item.listItemChildren ?? item.children}
              </div>
            );
          })}
        </div>
      </Popup>
    </div>
  );
});

export default SelectButton;
